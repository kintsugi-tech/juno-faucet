"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";
import { ExternalLinkIcon, Loader2 } from "lucide-react";

const FormSchema = z.object({
  address: z.string().min(34, {
    message: "Address must be at least 34 characters.",
  }),
});

export function FaucetForm() {
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      address: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    const res = await fetch("/api/faucet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (res.ok) {
      const body = await res.json();
      setTxHash(body.hash);
      toast.success("Tokens successuflly sent! 🎉");
    } else {
      const body = await res.json();
      toast.error(body.message ?? "Failed to send tokens");
    }

    console.log(res);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="juno1..." {...field} />
              </FormControl>
              <FormDescription>
                The juno address that will receive test tokens
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={loading}
        >
          {loading && <Loader2 className="animate-spin" />}
          Request Tokens
        </Button>
        {txHash && (
          <div className="w-full text-sm break-all">
            Tokens sent! <br />
            <br />
            <Link
              href={`https://chainroot.json`}
              target="_blank"
              className="items-center font-mono hover:underline"
            >
              {txHash}
              <ExternalLinkIcon className="inline-block ml-1 h-4 w-4  relative top-[-2px]" />
            </Link>
          </div>
        )}
      </form>
    </Form>
  );
}
