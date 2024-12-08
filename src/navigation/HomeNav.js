import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Image } from 'react-native';
import COLORS from '../utils/colors';
import Home from '../screens/Home';
import PostDetail from '../screens/PostDetail';
import CreatePost from '../screens/Explore';

const Stack = createNativeStackNavigator();

export default function HomeNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.background,
        },
        headerTintColor: COLORS.foreground,
      }}
      initialRouteName="Home"
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerTitle: '',
          headerLeft: () => <Image source={require('../../assets/reddit-logo.png')} style={{ width: 100, height: 30, resizeMode: 'contain' }} />,
        }}
      />
      <Stack.Screen name="Post" component={PostDetail} options={{ title: 'Post' }} />
      <Stack.Screen
        name="CreatePost"
        component={CreatePost}
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
