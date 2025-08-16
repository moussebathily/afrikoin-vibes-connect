import React from "react";
import { Plus } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

export function StoryCarousel() {
  const { user, profile } = useAuth();

  // Mock stories data - replace with real data later
  const stories = [
    { id: "1", user: "Marie", avatar: null, hasStory: true },
    { id: "2", user: "Ibrahim", avatar: null, hasStory: true },
    { id: "3", user: "Fatou", avatar: null, hasStory: true },
    { id: "4", user: "Kofi", avatar: null, hasStory: true },
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex space-x-4 overflow-x-auto">
        {/* Add Story */}
        <div className="flex flex-col items-center space-y-2 min-w-0 flex-shrink-0">
          <div className="relative">
            <Avatar className="h-16 w-16 border-2 border-dashed border-primary">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback>
                {profile?.name?.charAt(0)?.toUpperCase() ||
                  user?.email?.charAt(0)?.toUpperCase() ||
                  "U"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1">
              <Plus className="h-3 w-3" />
            </div>
          </div>
          <span className="text-xs font-medium text-center">Votre story</span>
        </div>

        {/* Stories */}
        {stories.map((story) => (
          <div
            key={story.id}
            className="flex flex-col items-center space-y-2 min-w-0 flex-shrink-0 cursor-pointer"
          >
            <div className="relative">
              <Avatar className="h-16 w-16 border-2 border-gradient-primary">
                <AvatarImage src={story.avatar} />
                <AvatarFallback>
                  {story.user.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {story.hasStory && (
                <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-20 animate-pulse" />
              )}
            </div>
            <span className="text-xs font-medium text-center truncate w-16">
              {story.user}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
