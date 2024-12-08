import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import HomeNav from './HomeNav';
import COLORS from '../utils/colors';
import Account from '../screens/Account';
import Icon from 'react-native-vector-icons/FontAwesome6';

const Tab = createBottomTabNavigator();

export default function BottomNav() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.muted,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          paddingTop: 10,
        },
      }}
    >
      <Tab.Screen
        name="HomeNav"
        component={HomeNav}
        options={{
          tabBarIcon: ({ color }) => <Icon name="house-chimney" size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="CreatePost"
        component={View}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('HomeNav', { screen: 'CreatePost' });
          },
        })}
        options={{
          tabBarIcon: ({ color }) => <Icon name="plus" size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarIcon: ({ color }) => <Icon name="user-astronaut" size={20} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
