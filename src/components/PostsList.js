import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import PostCard from './PostCard';
import { getPosts } from '../api/posts';
import { useQuery } from '@tanstack/react-query';
import COLORS from '../utils/colors';
const PostsList = () => {
  const { data, isLoading, isError } = useQuery({ queryKey: ['posts'], queryFn: getPosts });

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={{ padding: 10, gap: 10 }}
        ListEmptyComponent={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>No posts found</Text>
          </View>
        }
      />
    </View>
  );
};
export default PostsList;
const styles = StyleSheet.create({});
