import fl from 'fantasy-land';

export default function ap(b) {
  return function (a) {
    return a[fl.ap](b);
  };
}
