/* eslint-disable prettier/prettier */
"use client";

import type React from "react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send } from "lucide-react";
import {
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { getChatResponse, updateStore } from "@/services/user.service";

interface ChatSkeletonProps {
    isUser?: boolean
}

// eslint-disable-next-line no-global-assign
function ChatSkeleton({ isUser = false }: ChatSkeletonProps) {
    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={cn(
                    "max-w-[80%] rounded-lg p-3",
                    isUser ? "bg-primary/30" : "bg-muted/60",
                    "animate-pulse"
                )}
            >
                <div className="flex flex-col gap-1.5">
                    <div
                        className={cn(
                            "h-3 rounded",
                            isUser ? "bg-primary/40" : "bg-muted-foreground/20",
                            "w-24"
                        )}
                    />
                    <div
                        className={cn(
                            "h-3 rounded",
                            isUser ? "bg-primary/40" : "bg-muted-foreground/20",
                            "w-32"
                        )}
                    />
                    <div
                        className={cn(
                            "h-3 rounded",
                            isUser ? "bg-primary/40" : "bg-muted-foreground/20",
                            "w-16"
                        )}
                    />
                </div>
            </div>
        </div>
    );
}

// Create a client
const queryClient = new QueryClient();

// Wrapper component with QueryClientProvider
export function ChatDockWithProvider() {
    return (
        <QueryClientProvider client={queryClient}>
            <ChatDockInner />
        </QueryClientProvider>
    );
}

interface ChatMessage {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
    isStreaming?: boolean;
}


// Mock API function to simulate fetching a response from the backend
const fetchBotResponse = async (userMessage: string): Promise<string> => {
    // Simulate network delay
    const response = await getChatResponse(userMessage)

    // Choose a random response
    return response
};

// Mock streaming API function
const streamBotResponse = async (
    userMessage: string,
    onChunk: (chunk: string) => void
) => {
    // Simulate initial connection delay

    try {
        const response = await getChatResponse(userMessage)

        // Choose a random response
        const fullResponse = response;

        // Stream the response character by character
        let currentResponse = "";
        for (let i = 0; i < fullResponse.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, 20)); // Delay between characters
            currentResponse += fullResponse[i];
            onChunk(currentResponse);
        }

        return fullResponse;
    } catch (e) {
        
    }
};

function ChatDockInner() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "1",
            content: "Hello! How can I help you today?",
            isUser: false,
            timestamp: new Date(),
        },
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();

    // Mutation for sending a message and getting a response
    const mutation = useMutation({
        mutationFn: async (userMessage: string) => {
            // Create a temporary bot message with empty content
            const tempBotMessageId = (Date.now() + 1).toString();

            // Add a placeholder message that will be updated
            setMessages((prev) => [
                ...prev,
                {
                    id: tempBotMessageId,
                    content: "",
                    isUser: false,
                    timestamp: new Date(),
                    isStreaming: true,
                },
            ]);

            // Stream the response

            const response = await streamBotResponse(userMessage, (chunk) => {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === tempBotMessageId ? { ...msg, content: chunk } : msg
                    )
                );
            });

            // Update the message when streaming is complete
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === tempBotMessageId ? { ...msg, isStreaming: false } : msg
                )
            );

            return response;
        },
        onError: (error) => {
            console.error("Error sending message:", error);
            // Handle error state
        },
    });

    const toggleChat = async () => {
        setIsOpen(!isOpen);
        await updateStore()

    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim() || mutation.isPending) return;

        // Add user message
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            content: message,
            isUser: true,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);

        // Send to our mock API via React Query
        mutation.mutate(message);

        // Clear input
        setMessage("");
    };

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end">
            {isOpen && (
                <Card className="mb-2 w-80 shadow-lg md:w-96">
                    <CardHeader className="border-b p-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-medium">
                                Chat Support
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleChat}
                                className="h-8 w-8"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="h-80 overflow-y-auto p-4">
                        <div className="space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg p-3 ${msg.isUser
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted"
                                            }`}
                                    >
                                        {msg.content}
                                        {msg.isStreaming && (
                                            <span className="ml-1 inline-block animate-pulse">▋</span>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Show skeleton loader when mutation is pending and no streaming message is visible */}
                            {mutation.isPending &&
                                !messages.some((msg) => msg.isStreaming) && <ChatSkeleton />}

                            <div ref={messagesEndRef} />
                        </div>
                    </CardContent>
                    <CardFooter className="border-t p-4 pt-2">
                        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                            <Input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1"
                                disabled={mutation.isPending}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={mutation.isPending || !message.trim()}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            )}

            <Button
                onClick={toggleChat}
                variant={isOpen ? "secondary" : "default"}
                size="icon"
                className="h-12 w-12 rounded-full shadow-lg"
            >
                <MessageCircle className="h-6 w-6" />
            </Button>
        </div>
    );
}

// Export the wrapper component as ChatDock
export function ChatDock() {
    return <ChatDockWithProvider />;
}
