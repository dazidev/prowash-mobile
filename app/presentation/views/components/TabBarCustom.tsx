import { Key } from 'react';
import { FlexAlignType, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

export function TabBarCustom({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        position: 'absolute',
        left: 20,
        right: 20,
        bottom: insets.bottom,
        height: 70,
        marginHorizontal: 50,
        borderRadius: 35,
        backgroundColor: '#0D47A1',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 5 },
        elevation: 8,
      }}
    >
      {state.routes.map((route: any, index: any) => {
        const focused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const map = {
          UserProfile: ['person-outline', 'person'],
          Home: ['home-outline', 'home'],
          Services: ['bar-chart-outline', 'bar-chart'],
        } as Record<string, [string, string]>;

        const [inactive, active] = map[route.name] ?? [
          'help-circle-outline',
          'help-circle',
        ];

        const name = focused ? active : inactive;

        type RouteName = 'UserProfile' | 'Home' | 'Services';

        const alignMap = {
          Home: 'flex-start',
          UserProfile: 'center',
          Services: 'flex-end',
        };
        // TODO: ESTABA MAPEANDO LOS ALING Y DEBO APRENDER BIEN ESOS MAPEOS
        // Uso dentro del render de cada tab:
        const align = alignMap[route.name as RouteName] ?? 'center';

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={{
              flex: 1,
              alignItems: align as FlexAlignType,
              justifyContent: 'space-evenly',
              paddingHorizontal: 5,
            }}
            activeOpacity={0.8}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 60,
                backgroundColor: focused ? '#fff' : '',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name={name}
                size={focused ? 36 : 32}
                color={focused ? '#0D47A1' : '#cfd8dc'}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
