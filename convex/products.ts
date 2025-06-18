import {v} from "convex/values";
import {mutation, query} from "./_generated/server";

export const getTasks=query({
    args: {},
    handler: async (ctx) => {
        const tasks =await ctx.db.query("tasks").collect()
        return tasks
    }
});

export const addProduct =mutation ({
    args: {
        name: v.string(),
        price: v.number(),
    },
    handler: async(ctx, args) =>{
        const productId =await ctx.db.insert("products", {name: args.name, price: args.price});
        return productId;
    }
});

export const deleteProduct= mutation ({
    args : {
        id: v.id("products"),
    },
    handler: async(ctx, args) => {
        await ctx.db.delete(args.id);
    }
})