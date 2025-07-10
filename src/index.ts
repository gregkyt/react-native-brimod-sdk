import { NativeModules } from 'react-native';

const { RNBrimodSDK } = NativeModules;
export function selectTabBarItem({
  index,
  onNext,
}: {
  index: number;
  onNext?: () => void;
}) {
  RNBrimodSDK.selectTabBarItem(index)
    .then(() => {
      if (onNext) onNext();
    })
    .catch((err: string) => console.log(err));
}
