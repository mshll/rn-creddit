import { StyleSheet, Text, View } from 'react-native';
import PostsList from '../components/PostsList';
const Home = () => {
  return (
    <View style={{ flex: 1 }}>
      <PostsList />
    </View>
  );
};
export default Home;
const styles = StyleSheet.create({});
