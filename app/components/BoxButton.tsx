import { StyleSheet, Pressable, PressableProps, ViewStyle, StyleProp, GestureResponderEvent } from 'react-native'
import { router } from 'expo-router'
import { SvgProps } from 'react-native-svg';

type ValidRoutes = '/reminder' | '/digitaldiary' | '/meditationguide' | '/relaxationmusic' | '/meditateone' | '/meditatetwo' | '/meditatethree' | '/meditatefour' | '/meditatefive' | '/meditatesix';

interface BoxButtonProps extends Omit<PressableProps, 'style'> {
    backgroundColor?: string;
    textColor?: string;
    style?: StyleProp<ViewStyle>;
    icon?: React.ReactNode | React.FC<SvgProps>;
    iconSize?: number;
    iconColor?: string;
    href?: ValidRoutes;
}

const BoxButton = ({onPress, backgroundColor = '#2ED573', textColor = 'white', style, icon: Icon, iconSize = 48, iconColor = 'white', href, ...props}: BoxButtonProps) => {
  const handlePress = (event: GestureResponderEvent) => {
    if(href) {
        router.push(href as any)
    }

    if(onPress) {
        onPress(event)
    }
  }

  return (
    <Pressable 
        style={[styles.button, { backgroundColor }, style]}
        onPress={handlePress}
        {...props}
    >
      {Icon && typeof Icon === 'function' ? (
        <Icon width={iconSize} height={iconSize} color={iconColor} />
      ) : (
        Icon
      )}
    </Pressable>
  )
}

export default BoxButton

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 20,
        elevation: 3,
        width: 110,
        height: 110,
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
    },
});