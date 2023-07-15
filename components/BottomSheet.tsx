import React, { useEffect, useCallback, useRef } from 'react'
import { Dimensions, View, Text } from 'react-native';
import colors from '../config/colors';
import { PanGestureHandler, GestureDetector, GestureType, Gesture } from 'react-native-gesture-handler';
import Animated, { Extrapolate, interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import SPACING from '../config/SPACING';



const { height: SCREEN_HEIGHT } = Dimensions.get('window')

const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 70;


type BottomSheetProps = {
    children?: React.ReactNode
};




const BottomSheet = React.forwardRef<BottomSheetProps>(
    ({children}, ref) => {

    const translateY = useSharedValue(0);

    const scrollTo = useCallback((destination: number) => {
        'worklet';
        translateY.value = withSpring(destination, { damping: 50 })
    }, [])


    const context = useSharedValue({ y: 0 });

    const gesture = Gesture.Pan().onStart(() => {
        context.value = { y: translateY.value }
    }).onUpdate((event) => {
        translateY.value = event.translationY + context.value.y;
        translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y)
    }).onEnd(() => {
        if (translateY.value > -SCREEN_HEIGHT / 1.4) {
            scrollTo(-SCREEN_HEIGHT / 1.4)
        }
        else if (translateY.value < -SCREEN_HEIGHT / 2) {
            scrollTo(MAX_TRANSLATE_Y)
        }
    });

    useEffect(() => {
        scrollTo(-SCREEN_HEIGHT / 1.4)
    }, []);


    const rBottomSheetStyle = useAnimatedStyle(() => {
        const borderRadius = interpolate(translateY.value, [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y], [25, 5], Extrapolate.CLAMP);
        return {
            borderRadius,
            transform: [{ translateY: translateY.value }],
        }
    })

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View
                style={[
                    {
                        height: SCREEN_HEIGHT,
                        width: '100%',
                        backgroundColor: colors.white,
                        position: 'absolute',
                        top: SCREEN_HEIGHT,
                        // SCREEN_HEIGHT/1.7
                        borderRadius: 25,
                        padding: SPACING,
                    },
                    rBottomSheetStyle,
                ]}
            >
                {/* <View
                    style={{
                        width: 75,
                        height: 4,
                        backgroundColor: colors['dark-light'],
                        alignSelf: 'center',
                        marginVertical: 15,
                        borderRadius: 2,
                    }}
                /> */}
                {children}
            </Animated.View>
        </GestureDetector>
    )
});

export default BottomSheet