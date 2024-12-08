import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { getPostById, deletePost } from '../api/posts';
import { deleteComment, addComment } from '../api/comments';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { useState } from 'react';
import COLORS from '../utils/colors';

const PostDetail = ({ route }) => {
  const { postId } = route.params;
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [postVotes, setPostVotes] = useState(Math.floor(Math.random() * 1000));
  const [commentVotes, setCommentVotes] = useState({});
  const [username, setUsername] = useState('');
  const [commentText, setCommentText] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId),
  });

  const { mutate: submitComment, isLoading: isSubmittingComment } = useMutation({
    mutationFn: (commentData) => addComment(postId, commentData),
    onSuccess: () => {
      queryClient.invalidateQueries(['post', postId]);
      setUsername('');
      setCommentText('');
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to add comment');
    },
  });

  const handleSubmitComment = () => {
    submitComment({ username: username, comment: commentText });
  };

  const handleDeletePost = async () => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePost(postId);
            queryClient.invalidateQueries(['posts']);
            navigation.goBack();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete post');
          }
        },
      },
    ]);
  };

  const handleDeleteComment = async (commentId) => {
    Alert.alert('Delete Comment', 'Are you sure you want to delete this comment?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteComment(commentId);
            queryClient.invalidateQueries(['post', postId]);
          } catch (error) {
            Alert.alert('Error', 'Failed to delete comment');
          }
        },
      },
    ]);
  };

  const handlePostVote = (increment) => {
    setPostVotes((prev) => prev + (increment ? 1 : -1));
  };

  const handleCommentVote = (commentId, increment) => {
    setCommentVotes((prev) => ({
      ...prev,
      [commentId]: (prev[commentId] || Math.floor(Math.random() * 100)) + (increment ? 1 : -1),
    }));
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text>Error loading post</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.postContainer}>
          <Text style={styles.username}>u/snoo</Text>
          <Text style={styles.title}>{data?.title}</Text>
          <Text style={styles.description}>{data?.description}</Text>

          <View style={styles.actionBar}>
            <View style={styles.leftActions}>
              <View style={styles.voteContainer}>
                <TouchableOpacity onPress={() => handlePostVote(true)}>
                  <Icon name="arrow-up" size={16} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.voteCount}>{postVotes}</Text>
                <TouchableOpacity onPress={() => handlePostVote(false)}>
                  <Icon name="arrow-down" size={16} color={COLORS.text} />
                </TouchableOpacity>
              </View>

              <View style={styles.commentCountContainer}>
                <Icon name="comment" size={16} color={COLORS.text} />
                <Text style={styles.commentCount}>{data?.comments?.length || 0}</Text>
              </View>
            </View>

            <TouchableOpacity onPress={handleDeletePost}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.commentsHeader}>Comments</Text>
          {data?.comments?.length === 0 ? (
            <View style={styles.noCommentsContainer}>
              <Text style={styles.noCommentsText}>No comments yet. Be the first to comment!</Text>
            </View>
          ) : (
            data?.comments?.map((comment) => (
              <View key={comment.id} style={styles.commentContainer}>
                <Text style={styles.commentUsername}>u/{comment.username}</Text>
                <Text style={styles.commentText}>{comment.comment}</Text>

                <View style={styles.commentActionBar}>
                  <View style={styles.leftActions}>
                    <View style={styles.voteContainer}>
                      <TouchableOpacity onPress={() => handleCommentVote(comment.id, true)}>
                        <Icon name="arrow-up" size={16} color={COLORS.text} />
                      </TouchableOpacity>
                      <Text style={styles.voteCount}>{commentVotes[comment.id] || Math.floor(Math.random() * 100)}</Text>
                      <TouchableOpacity onPress={() => handleCommentVote(comment.id, false)}>
                        <Icon name="arrow-down" size={16} color={COLORS.text} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity onPress={() => handleDeleteComment(comment.id)}>
                    <Text style={styles.deleteButton}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.usernameInput}
          placeholder="Username"
          placeholderTextColor={COLORS.muted}
          value={username}
          onChangeText={setUsername}
        />
        <View style={styles.commentInputRow}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            placeholderTextColor={COLORS.muted}
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <TouchableOpacity
            style={[styles.submitButton, (!username.trim() || !commentText.trim() || isSubmittingComment) && styles.disabledButton]}
            onPress={handleSubmitComment}
            disabled={!username.trim() || !commentText.trim() || isSubmittingComment}
          >
            {isSubmittingComment ? <ActivityIndicator color={COLORS.background} size="small" /> : <Text style={styles.submitButtonText}>Post</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PostDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContainer: {
    padding: 15,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 8,
  },
  username: {
    fontSize: 14,
    color: COLORS.muted,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  description: {
    fontSize: 16,
    color: COLORS.text,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  voteCount: {
    fontSize: 14,
    color: COLORS.text,
    minWidth: 30,
    textAlign: 'center',
  },
  commentCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  commentCount: {
    fontSize: 14,
    color: COLORS.text,
  },
  commentsSection: {
    padding: 15,
    gap: 12,
  },
  commentsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  commentContainer: {
    padding: 10,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 5,
  },
  commentUsername: {
    fontSize: 12,
    color: COLORS.muted,
  },
  commentText: {
    fontSize: 14,
    color: COLORS.text,
  },
  commentActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  deleteButton: {
    fontSize: 12,
    color: COLORS.danger,
  },
  commentInputContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
    gap: 8,
  },
  usernameInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingTop: 8,
    color: COLORS.text,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: COLORS.background,
    fontSize: 14,
  },
  noCommentsContainer: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  noCommentsText: {
    color: COLORS.muted,
    fontSize: 14,
  },
});
