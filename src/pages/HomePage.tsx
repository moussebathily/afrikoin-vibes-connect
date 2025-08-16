import React, { useEffect, useState } from "react";
import { PostCard } from "@/components/posts/PostCard";
import { StoryCarousel } from "@/components/stories/StoryCarousel";
import { WelcomeCard } from "@/components/home/WelcomeCard";
import { FestivalBanner } from "@/components/holidays/FestivalBanner";
import { IndependenceBanner } from "@/components/holidays/IndependenceBanner";
import { EntertainmentSection } from "@/components/entertainment/EntertainmentSection";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          profiles!posts_user_id_fkey(name, country, is_verified),
          media_files(*)
        `,
        )
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke("like-post", {
        body: { postId },
      });

      if (error) {
        console.error("Error liking post:", error);

        // Check for insufficient credits
        if (error.message?.includes("INSUFFICIENT_CREDITS")) {
          toast.error("Crédits insuffisants", {
            description: "Vous n'avez plus de crédits likes",
            action: {
              label: "Acheter des likes",
              onClick: () => (window.location.href = "/wallet"),
            },
          });
        }
        return;
      }

      if (!data?.success) {
        console.error("Error liking post:", data);
        return;
      }

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, like_count: data.like_count } : post,
        ),
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Welcome Card for new users */}
      <WelcomeCard />

      {/* Discover AfriKoin CTA */}
      <section
        aria-label={t("marketing.cta.getStarted")}
        className="rounded-lg border bg-card text-card-foreground p-4"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold">
              {t("marketing.hero.title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("marketing.hero.tagline") || t("app.tagline")}
            </p>
          </div>
          <Button asChild variant="secondary">
            <Link to="/about">{t("marketing.cta.getStarted")}</Link>
          </Button>
        </div>
      </section>

      {/* Independence Day Banner (shows only on your country's Independence Day) */}
      <IndependenceBanner />

      {/* Festival Banner */}
      <FestivalBanner />

      {/* Stories Carousel */}
      <StoryCarousel />

      {/* Cultural & Entertainment */}
      <EntertainmentSection />

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={() => handleLikePost(post.id)}
          />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            {t("posts.noPostsYet")}
          </h3>
          <p className="text-muted-foreground">{t("posts.beFirst")}</p>
        </div>
      )}
    </div>
  );
}
