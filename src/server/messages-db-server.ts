"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "./db"
import { messages } from "./db/schema"
import { and, eq, or } from "drizzle-orm"

export async function send_message(message_data: {
    message: string,
    sender_clerk: string,
    reciever_clerk: string,
}) {
    const user = await auth()

    if (user?.userId == message_data.sender_clerk) {
        const db_messages_data = await db.select().from(messages).where(
            or(
                and(
                    eq(messages.userOneId, message_data.sender_clerk),
                    eq(messages.userTwoId, message_data.reciever_clerk)
                ),
                and(
                    eq(messages.userOneId, message_data.reciever_clerk),
                    eq(messages.userTwoId, message_data.sender_clerk)
                )
            )
        )

        try {
            if (db_messages_data.length > 0) {
                await db.update(messages).set({
                    content: [...(db_messages_data[0]?.content as {
                        message: string,
                        sender_clerk: string,
                        reciever_clerk: string,
                    }[]), message_data]
                }).where(
                    or(
                        and(
                            eq(messages.userOneId, message_data.sender_clerk),
                            eq(messages.userTwoId, message_data.reciever_clerk)
                        ),
                        and(
                            eq(messages.userOneId, message_data.reciever_clerk),
                            eq(messages.userTwoId, message_data.sender_clerk)
                        )
                    )
                )
            }
            else if (message_data.sender_clerk && message_data.reciever_clerk) {
                await db.insert(messages).values({
                    userOneId: message_data.sender_clerk,
                    userTwoId: message_data.reciever_clerk,
                    content: [message_data]
                })
            }

            return 1;
        }
        catch {}
    }
    return 0;
}

export async function get_messages_data(user_one_id: string, user_two_id: string) {
    const user = await auth()
    if (user?.userId == user_one_id || user?.userId == user_two_id) {
        const db_messages_data = await db.select().from(messages).where(
            or(
                and(
                    eq(messages.userOneId, user_one_id),
                    eq(messages.userTwoId, user_two_id)
                ),
                and(
                    eq(messages.userOneId, user_two_id),
                    eq(messages.userTwoId, user_one_id)
                )
            )
        )

        if (db_messages_data.length > 0) {
            return db_messages_data[0]?.content
        }
        else if (user_one_id && user_two_id) {
            await db.insert(messages).values({
                userOneId: user_one_id,
                userTwoId: user_two_id,
                content: []
            })
            return []
        }
    }
    return 0
}