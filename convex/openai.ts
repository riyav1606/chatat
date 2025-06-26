import OpenAI from "openai";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("❌ OPENAI_API_KEY is missing in environment variables.");
}

const openai = new OpenAI({ apiKey });

export const chat = action({
  args: {
    messageBody: v.string(),
    conversation: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    try {
      const res = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a terse bot in a group chat responding to questions with 1-sentence answers",
          },
          {
            role: "user",
            content: args.messageBody,
          },
        ],
      });

      const messageContent = res.choices[0]?.message?.content ?? "🤖 Sorry, I don't have a response.";

      await ctx.runMutation(api.messages.sendChatGPTMessage, {
        content: messageContent,
        conversation: args.conversation,
        messageType: "text",
      });
    } catch (error: any) {
      console.error("💥 OpenAI Chat error:", error);

      const fallbackMessage =
        error.message?.includes("429")
          ? "⚠️ You've exceeded your OpenAI quota. Please wait or upgrade your plan."
          : "⚠️ Error talking to ChatGPT. Please try again later.";

      await ctx.runMutation(api.messages.sendChatGPTMessage, {
        content: fallbackMessage,
        conversation: args.conversation,
        messageType: "text",
      });
    }
  },
});

export const dall_e = action({
  args: {
    conversation: v.id("conversations"),
    messageBody: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const res = await openai.images.generate({
        model: "dall-e-3",
        prompt: args.messageBody,
        n: 1,
        size: "1024x1024",
      });

      const imageUrl = res.data?.[0]?.url ?? "/poopenai.png";

      await ctx.runMutation(api.messages.sendChatGPTMessage, {
        content: imageUrl,
        conversation: args.conversation,
        messageType: "image",
      });
    } catch (error: any) {
      console.error("💥 DALL·E image error:", error);

      const fallbackImage = "/poopenai.png";
      const message = error.message?.includes("429")
        ? "⚠️ Image generation quota exceeded."
        : "⚠️ Couldn't generate image right now.";

      await ctx.runMutation(api.messages.sendChatGPTMessage, {
        content: `${message} Here's a placeholder: ${fallbackImage}`,
        conversation: args.conversation,
        messageType: "text",
      });
    }
  },
});
