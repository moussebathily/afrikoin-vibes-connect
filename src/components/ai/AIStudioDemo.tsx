import React, { useState } from "react";
import { Bot, Image, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AIContentModerator } from "./AIContentModerator";
import { AIDescriptionEnhancer } from "./AIDescriptionEnhancer";
import { AIThumbnailGenerator } from "./AIThumbnailGenerator";

export function AIStudioDemo() {
  const [currentDemo, setCurrentDemo] = useState<
    "moderator" | "enhancer" | "thumbnail"
  >("moderator");

  const demoData = {
    productName: "Chaussures Nike Air Max",
    description: "Chaussures sport homme taille 42",
    price: 25000,
    currency: "XOF",
    category: "Chaussures",
    imageUrl: "https://via.placeholder.com/300x300",
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            Studio IA AfriKoin - Démo
          </CardTitle>
          <p className="text-muted-foreground">
            Testez toutes les fonctionnalités d'intelligence artificielle
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={currentDemo === "moderator" ? "default" : "outline"}
              onClick={() => setCurrentDemo("moderator")}
              size="sm"
            >
              🛡️ Modération
            </Button>
            <Button
              variant={currentDemo === "enhancer" ? "default" : "outline"}
              onClick={() => setCurrentDemo("enhancer")}
              size="sm"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Description
            </Button>
            <Button
              variant={currentDemo === "thumbnail" ? "default" : "outline"}
              onClick={() => setCurrentDemo("thumbnail")}
              size="sm"
            >
              <Image className="h-4 w-4 mr-1" />
              Miniature
            </Button>
          </div>

          {currentDemo === "moderator" && (
            <AIContentModerator
              imageUrl={demoData.imageUrl}
              text={demoData.description}
              autoModerate={true}
            />
          )}

          {currentDemo === "enhancer" && (
            <AIDescriptionEnhancer
              initialDescription={demoData.description}
              category={demoData.category}
              price={demoData.price.toString()}
            />
          )}

          {currentDemo === "thumbnail" && (
            <AIThumbnailGenerator
              productName={demoData.productName}
              price={demoData.price}
              currency={demoData.currency}
              category={demoData.category}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
