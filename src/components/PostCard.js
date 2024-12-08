import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import COLORS from '../utils/colors';
import { useNavigation } from '@react-navigation/native';
const PostCard = ({ post }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Post', { postId: post.id })}>
      <View style={styles.container}>
        <Text style={styles.username}>u/{post?.username || 'snoo'}</Text>
        <Text style={styles.title}>{post?.title || 'This is a title'}</Text>
        <Text style={styles.content}>{post?.description || 'This is a description'}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 5,
  },
  username: {
    fontSize: 12,
    color: COLORS.muted,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    fontSize: 12,
    color: COLORS.muted,
  },
});
