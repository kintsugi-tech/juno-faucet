import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { createClient } from "redis";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";

const cfg = {
  DISPOSING_AMOUNT: process.env.DISPOSING_AMOUNT ?? 50000000,
  CHAIN_PREFIX: process.env.CHAIN_PREFIX ?? "juno",
  CHAIN_DENOM: process.env.CHAIN_DENOM ?? "ujunox",
  CHAIN_RPC: process.env.CHAIN_RPC ?? "https://rpc-uni.junonetwork.io",
  FAUCET_MNEMONIC: process.env.FAUCET_MNEMONIC ?? "",
};

const redis = await createClient({ url: process.env.REDIS_URL }).connect();

export const POST = auth(async function POST(req) {
  if (!req.auth || !req.auth.user || !req.auth.user.email) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { address } = await req.json();

  if (!address) {
    return NextResponse.json(
      { message: "Address is required" },
      { status: 400 }
    );
  }

  const user = req.auth.user;
  const lastFaucet = await redis.get(`${user.email}`);

  // check cooldown
  if (lastFaucet !== null && Date.now() - parseInt(lastFaucet) < 43200000) {
    return NextResponse.json(
      { message: "You can only request 50 JUNOx every 12 hours." },
      { status: 429 }
    );
  }

  // Send tokens
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
    cfg.FAUCET_MNEMONIC,
    {
      prefix: cfg.CHAIN_PREFIX,
    }
  );

  const [firstAccount] = await wallet.getAccounts();
  const senderAddress = firstAccount.address;

  // Create signing client
  const client = await SigningStargateClient.connectWithSigner(
    cfg.CHAIN_RPC,
    wallet
  );

  const balance = await client.getBalance(senderAddress, cfg.CHAIN_DENOM);
  if (BigInt(balance.amount) < BigInt(cfg.DISPOSING_AMOUNT)) {
    return NextResponse.json(
      { message: "Faucet is out of funds. Please try again later." },
      { status: 503 }
    );
  }

  // Send tokens
  try {
    const result = await client.sendTokens(
      senderAddress,
      address,
      [
        {
          denom: cfg.CHAIN_DENOM,
          amount: cfg.DISPOSING_AMOUNT.toString(),
        },
      ],
      {
        amount: [{ denom: "ujunox", amount: "20000" }],
        gas: "200000",
      },
      "Happy building!"
    );

    // Save faucet request date
    await redis.set(`${user.email}`, Date.now().toString());

    return NextResponse.json(
      {
        message: "Tokens sent!",
        hash: result.transactionHash,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to send tokens. Please try again later.",
        error: error,
      },
      { status: 500 }
    );
  }
});
