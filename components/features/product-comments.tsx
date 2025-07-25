import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/components/layout/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsDown, Loader2, User, ThumbsUp, Trash2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import {
  getProductComments,
  addProductComment,
  likeProductComment,
  dislikeProductComment,
  getUserById,
  deleteProductComment,
} from "@/lib/firestore";
import { APP_CONSTANTS } from "@/lib/constants";

interface ProductCommentsProps {
  productSku: string;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  text: string;
  createdAt: any;
  likes: string[];
  dislikes: string[];
}

export function ProductComments({ productSku }: ProductCommentsProps) {
  const { user, userData, isLoggedIn, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [likeLoading, setLikeLoading] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !isLoggedIn) {
      setLoading(false);
      setComments([]);
      return;
    }
    setLoading(true);
    getProductComments(productSku)
      .then(async (data) => {
        // Obtener publicTag real para cada usuario
        const commentsWithTags = await Promise.all(
          (data as Comment[]).map(async (comment) => {
            if (comment.userId) {
              const userData = await getUserById(comment.userId);
              return {
                ...comment,
                userName:
                  userData?.publicTag ||
                  comment.userName ||
                  userData?.displayName ||
                  "@user",
              };
            }
            return comment;
          })
        );
        setComments(commentsWithTags);
      })
      .finally(() => setLoading(false));
  }, [productSku, isLoggedIn, authLoading]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;
    setSubmitting(true);
    try {
      await addProductComment(productSku, {
        userId: user.uid,
        userName:
          userData?.publicTag || user.displayName || user.email || "@user",
        userPhotoURL: user.photoURL,
        text: newComment.trim(),
        createdAt: new Date(),
      });
      setNewComment("");
      // Refetch comments
      const updated = await getProductComments(productSku);
      setComments(updated as Comment[]);
    } catch (e: any) {
      toast({
        title: t("product.comments.errorAdd"),
        description: e?.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: string, alreadyLiked: boolean) => {
    if (!user) return;
    setLikeLoading(commentId);
    try {
      await likeProductComment(productSku, commentId, user.uid, alreadyLiked);
      const updated = await getProductComments(productSku);
      setComments(updated as Comment[]);
    } finally {
      setLikeLoading(null);
    }
  };

  const handleDislike = async (commentId: string, alreadyDisliked: boolean) => {
    if (!user) return;
    setLikeLoading(commentId);
    try {
      await dislikeProductComment(
        productSku,
        commentId,
        user.uid,
        alreadyDisliked
      );
      const updated = await getProductComments(productSku);
      setComments(updated as Comment[]);
    } finally {
      setLikeLoading(null);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!user) return;
    setLikeLoading(commentId);
    try {
      await deleteProductComment(productSku, commentId);
      const updated = await getProductComments(productSku);
      // Volver a mapear los publicTag
      const commentsWithTags = await Promise.all(
        (updated as Comment[]).map(async (comment) => {
          if (comment.userId) {
            const userData = await getUserById(comment.userId);
            return {
              ...comment,
              userName:
                userData?.publicTag ||
                comment.userName ||
                userData?.displayName ||
                "@user",
            };
          }
          return comment;
        })
      );
      setComments(commentsWithTags);
    } finally {
      setLikeLoading(null);
    }
  };

  if (!isLoggedIn) {
    return (
      <Card className="my-6">
        <CardHeader>
          <CardTitle>{t("product.comments.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{t("product.comments.loginToComment")}</p>
          <Button onClick={() => (window.location.href = "/login")}>
            {t("navigation.signIn")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="my-6">
      <CardHeader>
        <CardTitle>{t("product.comments.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <>
            {comments.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                {t("product.comments.noComments")}
              </div>
            ) : (
              <div className="space-y-6 mb-6">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex items-start gap-3 border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <Avatar>
                      {comment.userPhotoURL ? (
                        <AvatarImage
                          src={comment.userPhotoURL}
                          alt={comment.userName}
                        />
                      ) : (
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-primary">
                          {comment.userName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {comment.createdAt?.toDate
                            ? comment.createdAt.toDate().toLocaleString()
                            : ""}
                        </span>
                      </div>
                      <div className="text-foreground mb-2">{comment.text}</div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className={
                            user && comment.likes.includes(user.uid)
                              ? "text-green-600"
                              : "text-muted-foreground"
                          }
                          onClick={() =>
                            user &&
                            handleLike(
                              comment.id,
                              comment.likes.includes(user.uid)
                            )
                          }
                          disabled={likeLoading === comment.id}
                        >
                          <ThumbsUp
                            className={
                              user && comment.likes.includes(user.uid)
                                ? "fill-current"
                                : ""
                            }
                          />
                          <span className="ml-1">{comment.likes.length}</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className={
                            user && comment.dislikes.includes(user.uid)
                              ? "text-blue-500"
                              : "text-muted-foreground"
                          }
                          onClick={() =>
                            user &&
                            handleDislike(
                              comment.id,
                              comment.dislikes.includes(user.uid)
                            )
                          }
                          disabled={likeLoading === comment.id}
                        >
                          <ThumbsDown
                            className={
                              user && comment.dislikes.includes(user.uid)
                                ? "fill-current"
                                : ""
                            }
                          />
                          <span className="ml-1">
                            {comment.dislikes.length}
                          </span>
                        </Button>
                        {user &&
                          (user.uid === comment.userId ||
                            user.email === APP_CONSTANTS.ADMIN_EMAIL) && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => handleDelete(comment.id)}
                              disabled={likeLoading === comment.id}
                              title={t("product.comments.delete")}
                            >
                              <Trash2 />
                            </Button>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t("product.comments.addPlaceholder")}
                rows={3}
                className="mb-2"
                maxLength={500}
              />
              <Button
                onClick={handleAddComment}
                disabled={submitting || !newComment.trim()}
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t("product.comments.add")
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
