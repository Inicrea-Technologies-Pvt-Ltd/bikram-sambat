/**
 * Minimal React Native primitives rendered as DOM elements.
 *
 * This exists so the components' own logic — selection, navigation, bounds,
 * conversion — can be tested in jsdom. It stubs React Native's surface, not its
 * behaviour: it proves our code is correct, not that RN renders it a certain way.
 */
import { forwardRef, type ReactNode } from 'react';

type AnyStyle = unknown;

interface BaseProps {
  children?: ReactNode;
  style?: AnyStyle;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  accessibilityState?: { disabled?: boolean; selected?: boolean; expanded?: boolean };
  numberOfLines?: number;
}

interface PressableProps extends Omit<BaseProps, 'style'> {
  style?: AnyStyle | ((state: { pressed: boolean }) => AnyStyle);
  onPress?: (event: { stopPropagation?: () => void }) => void;
  disabled?: boolean;
}

const domProps = (props: BaseProps) => ({
  'data-testid': props.testID,
  'aria-label': props.accessibilityLabel,
});

export const View = forwardRef<HTMLDivElement, BaseProps>(function View(props, ref) {
  return (
    <div ref={ref} {...domProps(props)}>
      {props.children}
    </div>
  );
});

export const Text = forwardRef<HTMLSpanElement, BaseProps>(function Text(props, ref) {
  return (
    <span ref={ref} {...domProps(props)}>
      {props.children}
    </span>
  );
});

/**
 * React Native lets Pressables nest (a modal backdrop wrapping its content is
 * the standard idiom); the DOM does not let `<button>` nest. So only a
 * Pressable that declares `accessibilityRole="button"` becomes a real button —
 * wrappers like the backdrop become a div with the role applied instead.
 */
export const Pressable = forwardRef<HTMLElement, PressableProps>(function Pressable(props, ref) {
  const { onPress, disabled, children, accessibilityState, accessibilityRole } = props;
  const isDisabled = disabled || accessibilityState?.disabled;
  const shared = {
    'data-testid': props.testID,
    'aria-label': props.accessibilityLabel,
    'aria-selected': accessibilityState?.selected,
    'aria-expanded': accessibilityState?.expanded,
    onClick: () => {
      if (!isDisabled) onPress?.({ stopPropagation: () => {} });
    },
  };

  if (accessibilityRole === 'button') {
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        disabled={isDisabled}
        {...shared}
      >
        {children}
      </button>
    );
  }

  return (
    <div ref={ref as React.Ref<HTMLDivElement>} role="button" aria-disabled={isDisabled} {...shared}>
      {children}
    </div>
  );
});

interface TextInputProps extends BaseProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  keyboardType?: string;
  autoCorrect?: boolean;
  autoCapitalize?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(props, ref) {
  return (
    <input
      ref={ref}
      type="text"
      value={props.value}
      placeholder={props.placeholder}
      data-testid={props.testID}
      aria-label={props.accessibilityLabel}
      onChange={(event) => props.onChangeText?.(event.target.value)}
    />
  );
});

export function Modal(props: { visible?: boolean; children?: ReactNode; onRequestClose?: () => void }) {
  if (!props.visible) return null;
  return <div data-testid="modal">{props.children}</div>;
}

export const StyleSheet = {
  create: <T extends Record<string, unknown>>(styles: T): T => styles,
  flatten: (style: unknown) => style,
  absoluteFill: {},
  hairlineWidth: 1,
};

export type StyleProp<T> = T | T[] | null | undefined;
export type ViewStyle = Record<string, unknown>;
export type TextStyle = Record<string, unknown>;
