import React, { useRef, useState, ReactNode } from 'react';
import {
  ScrollView,
  Platform,
  Dimensions,
  NativeScrollEvent,
} from 'react-native';
import { RStack } from '@packrat/ui';
import ScrollButton from './ScrollButton';
import useCustomStyles from 'app/hooks/useCustomStyles';
import { useScreenWidth } from 'app/hooks/common';
import { SCREEN_WIDTH } from 'app/constants/breakpoint';

interface CarouselProps {
  children?: ReactNode[];
  itemWidth?: number;
  iconColor?: string;
}

const { height, width } = Dimensions.get('window');

const Carousel: React.FC<CarouselProps> = ({
  children = [],
  itemWidth ,
  iconColor,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const styles = useCustomStyles(loadStyles);
  const { screenWidth } = useScreenWidth();

  const handleScroll = (event: { nativeEvent: NativeScrollEvent }) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const newIndex = Math.round(contentOffset.x / itemWidth || undefined);
    setCurrentIndex(newIndex);
  };

  const scrollToIndex = (index: number) => {
    if (index >= 0 && index < children.length && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * 220,
        y: 0,
        animated: true,
      });
      setCurrentIndex(index);
    }
  };

  return (
    <RStack
      style={{
        alignSelf: 'center',
        width:
          Platform.OS === 'web'
            ? screenWidth <= SCREEN_WIDTH
              ? '80vw'
              : '90%'
            : width * 0.7,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}
    >
      <ScrollButton
        direction="left"
        onPress={() => {
          scrollToIndex(currentIndex - 1);
        }}
        disabled={currentIndex === 0}
      />

      <ScrollView
        ref={scrollViewRef}
        horizontal
        scrollEnabled={Platform.OS === 'web'}
        // gestureEnabled={false} // Add this prop
        style={styles.carousel}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexDirection: 'row' }}
        pagingEnabled
        onMomentumScrollEnd={handleScroll}
      >
        {children &&
          children.map((child, index) => (
            <RStack
              key={index}
              style={{
                marginRight: 10,
                marginTop: 10,
                flexDirection: 'row',
              }}
            >
              {child}
            </RStack>
          ))}
      </ScrollView>
      <ScrollButton
        direction="right"
        onPress={() => {
          scrollToIndex(currentIndex + 1);
        }}
        disabled={currentIndex === children?.length - 1}
      />
    </RStack>
  );
};

const loadStyles = () => ({
  carousel: {
    flexDirection: 'row',
    width: Platform.OS === 'web' ? '100%' : width * 0.8,
  },
});

export default Carousel;
