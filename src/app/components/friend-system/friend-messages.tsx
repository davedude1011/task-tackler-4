import { useAuth } from "@clerk/nextjs";
import { SendIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import { get_messages_data, send_message } from "~/server/messages-db-server";
import { database } from "~/app/firebase";
import { ref, onValue, push, remove } from "firebase/database";

export default function FriendMessages({
  reciever_clerk,
}: {
  reciever_clerk: string | null;
}) {
  const { userId, isSignedIn } = useAuth();
  const [messages, setMessages] = useState<
    { message: string; sender_clerk: string; reciever_clerk: string }[]
  >([]);
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    if (isSignedIn && reciever_clerk) {
      const messagesRef = ref(database, "messages");

      const unsubscribe = onValue(messagesRef, (snapshot) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data = snapshot.val();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newMessages: any[] = [];

        for (const key in data) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const messageData = data[key];
          if (
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            messageData.reciever_clerk === userId &&
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            messageData.sender_clerk === reciever_clerk
          ) {
            // Collect messages intended for the receiver
            newMessages.push({ ...messageData, firebaseKey: key });
          }
        }

        // Append new messages to existing messages
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        setMessages((prev) => [
          ...prev,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          ...newMessages.filter(
            (msg) =>
              !prev.some(
                (prevMsg) =>
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                  prevMsg.message === msg.message &&
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                  prevMsg.sender_clerk === msg.sender_clerk,
              ),
          ),
        ]);

        // Delete messages once read
        newMessages.forEach((msg) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (msg.firebaseKey) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const messageRef = ref(database, `messages/${msg.firebaseKey}`);
            remove(messageRef).catch((err) =>
              console.error("Error deleting message from Firebase:", err),
            );
          }
        });
      });

      return () => {
        unsubscribe();
      };
    }
  }, [isSignedIn, reciever_clerk, userId]);

  // Fetch existing messages on initial render
  useEffect(() => {
    if (userId && reciever_clerk) {
      get_messages_data(userId, reciever_clerk)
        .then((response) => {
          if (typeof response == "number" && response == 0) {
            toast("Error", {
              description: "There was an error fetching the messages :[",
            });
            setMessages([]);
          } else {
            setMessages(
              response as {
                message: string;
                sender_clerk: string;
                reciever_clerk: string;
              }[],
            );
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [reciever_clerk, userId]);

  const send = () => {
    const newMessage = {
      message: inputValue,
      sender_clerk: userId,
      reciever_clerk: reciever_clerk!,
    };

    if (
      newMessage.message &&
      newMessage.reciever_clerk &&
      newMessage.sender_clerk
    ) {
      // @ts-expect-error dhgisoghiledukfgbhdklfiughidflkghsdilkuf7gsdlukfiygksduyfglksduygksudfygvbs
      setMessages((prev) => [...prev, newMessage]);
      setInputValue("");

      // @ts-expect-error ive run out of things to say...
      // Save message in the long-term database
      send_message(newMessage)
        .then((response) => {
          if (typeof response === "number" && response === 0) {
            toast("Error", {
              description: "There was an error and the message did not send :[",
            });
          }
        })
        .catch(console.error);

      // Save message in Firebase for real-time updates
      const messagesRef = ref(database, "messages");
      push(messagesRef, newMessage).catch(console.error);
    }
  };

  if (!reciever_clerk) return null;

  return (
    <div className="flex flex-grow flex-col gap-4 rounded-md border p-2">
      <div className="flex-grow">
        {messages.length > 0 ? (
          messages.map((currentMessageData, index) => (
            <div
              key={index}
              className={`${
                currentMessageData.sender_clerk === userId
                  ? "justify-end"
                  : "justify-start"
              } flex`}
            >
              <div
                className={`${
                  currentMessageData.sender_clerk === userId
                    ? "text-right"
                    : "text-left"
                } w-2/3`}
              >
                {currentMessageData.message}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center">No messages yet :[</div>
        )}
      </div>
      <div>
        <div className="flex flex-row gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.currentTarget.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <Button size="icon" onClick={send}>
            <SendIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
