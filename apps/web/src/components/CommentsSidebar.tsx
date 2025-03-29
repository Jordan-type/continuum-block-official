import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Paperclip, Smile, Sparkles } from "lucide-react";

interface Comment {
  userInitials: string;
  userName: string;
  timestamp: string;
  message: string;
  isUnread?: boolean;
  isUnresolved?: boolean;
}

const CommentsSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    {
      userInitials: "ME",
      userName: "Matthew Edmond",
      timestamp: "00:28:11",
      message: "Let's lighten the shadow here.",
      isUnread: true,
      isUnresolved: true,
    },
    {
      userInitials: "DS",
      userName: "Daniel Smith",
      timestamp: "a few seconds ago",
      message: "I'm on it!",
      isUnread: true,
      isUnresolved: true,
    },
    {
      userInitials: "EM",
      userName: "Emily Mendoza",
      timestamp: "00:28:09",
      message: "Can we swap this for another product shot?",
      isUnread: true,
      isUnresolved: true,
    },
    {
      userInitials: "JL",
      userName: "Juliet Liu",
      timestamp: "a few seconds ago",
      message: "Overall, this story is coming together nicely!",
      isUnread: false,
      isUnresolved: false,
    },
  ]);
  const [newComment, setNewComment] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          userInitials: "DR", // Replace with actual user initials
          userName: "Your Name", // Replace with actual user name
          timestamp: "00:03:87",
          message: newComment,
          isUnread: false,
          isUnresolved: true,
        },
      ]);
      setNewComment("");
    }
  };

  const filteredComments = comments.filter((comment) => {
    if (activeFilter === "Unread") return comment.isUnread;
    if (activeFilter === "Unresolved") return comment.isUnresolved;
    if (activeFilter === "Resolved") return !comment.isUnresolved;
    return true; // "All"
  });

  return (
    <div
      className={`comments-sidebar ${isCollapsed ? "comments-sidebar--collapsed" : ""}`}
      style={{
        width: isCollapsed ? "50px" : "300px",
        transition: "width 0.3s ease",
        backgroundColor: "#1a1a1a",
        color: "#fff",
        height: "100vh",
        position: "fixed",
        right: 0,
        top: 0,
        overflowY: "auto",
        padding: isCollapsed ? "10px" : "20px",
        borderLeft: "1px solid #333",
      }}
    >
      <div className="comments-sidebar__header">
        {!isCollapsed && (
          <h3 className="comments-sidebar__title">Comments</h3>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="comments-sidebar__toggle"
        >
          {isCollapsed ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>

      {!isCollapsed && (
        <>
          <Tabs
            value={activeFilter}
            onValueChange={setActiveFilter}
            className="comments-sidebar__filters"
          >
            <TabsList className="comments-sidebar__filter-list">
              <TabsTrigger value="Unread" className="comments-sidebar__filter">
                Unread ({comments.filter((c) => c.isUnread).length})
              </TabsTrigger>
              <TabsTrigger value="Unresolved" className="comments-sidebar__filter">
                Unresolved
              </TabsTrigger>
              <TabsTrigger value="Resolved" className="comments-sidebar__filter">
                Resolved
              </TabsTrigger>
              <TabsTrigger value="All" className="comments-sidebar__filter">
                All
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="comments-sidebar__list">
            {filteredComments.map((comment, index) => (
              <div key={index} className="comments-sidebar__comment">
                <div className="comments-sidebar__comment-header">
                  <Avatar className="comments-sidebar__avatar">
                    <AvatarFallback
                      style={{
                        backgroundColor:
                          comment.userInitials === "ME"
                            ? "#ff8c00"
                            : comment.userInitials === "DS"
                            ? "#ff69b4"
                            : comment.userInitials === "EM"
                            ? "#dda0dd"
                            : "#ffd700",
                      }}
                    >
                      {comment.userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="comments-sidebar__comment-info">
                    <span className="comments-sidebar__user-name">{comment.userName}</span>
                    <span className="comments-sidebar__timestamp">{comment.timestamp}</span>
                  </div>
                </div>
                <p className="comments-sidebar__message">{comment.message}</p>
                <Button variant="link" className="comments-sidebar__reply">
                  Reply
                </Button>
              </div>
            ))}
          </div>

          <div className="comments-sidebar__input-container">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Your thoughts here"
              className="comments-sidebar__input"
              style={{ backgroundColor: "#333", color: "#fff", border: "none" }}
            />
            <div className="comments-sidebar__input-actions">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Smile className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Sparkles className="h-4 w-4" />
              </Button>
              <Button onClick={handleAddComment} className="comments-sidebar__post-button">
                Post
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CommentsSidebar;