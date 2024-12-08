import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import COLORS from '../utils/colors';
import Home from '../screens/Home';
import PostDetail from '../screens/PostDetail';

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
      <Stack.Screen name="Home" component={Home} options={{}} />
      <Stack.Screen name="Post" component={PostDetail} options={{ title: 'Post' }} />
    </Stack.Navigator>
  );
}
