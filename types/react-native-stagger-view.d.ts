// types/react-native-stagger-view.d.ts

declare module '@mindinventory/react-native-stagger-view' {
  import { Component, ReactNode } from 'react';
  import { StyleProp, ViewStyle, RefreshControlProps } from 'react-native';

  type AnimationType =
    | 'FADE_IN_FAST'
    | 'SLIDE_LEFT'
    | 'SLIDE_DOWN'
    | 'EFFECTIVE'
    | 'FLIPPED'
    | 'NONE';

  interface StaggeredListProps<T> {
    data: T[];
    renderItem: (params: { item: T; index: number }) => ReactNode;
    keyExtractor: (item: T, index: number) => string;
    animationType?: AnimationType;
    innerRef?: React.MutableRefObject<any>;
    keyPrefix?: string;
    loading?: boolean;
    refreshing?: RefreshControlProps['refreshing'];
    onRefresh?: RefreshControlProps['onRefresh'];
    onEndReached?: () => void;
    onEndReachedThreshold?: number;
    style?: StyleProp<ViewStyle>;
    LoadingView?: ReactNode;
    ListHeaderComponent?: ReactNode;
    ListEmptyComponent?: ReactNode;
    ListFooterComponent?: ReactNode;
    ListHeaderComponentStyle?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    numColumns?: number;
  }

  export default class StaggeredList<T> extends Component<StaggeredListProps<T>> {}
}
