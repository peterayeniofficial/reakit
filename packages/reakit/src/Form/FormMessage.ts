import { BoxOptions, BoxHTMLProps, useBox } from "../Box/Box";
import { unstable_createComponent } from "../utils/createComponent";
import { As, PropsWithAs } from "../__utils/types";
import { unstable_createHook } from "../utils/createHook";
import { unstable_FormStateReturn, unstable_useFormState } from "./FormState";
import { unstable_getIn } from "./utils/getIn";
import { getMessageId } from "./__utils/getMessageId";
import { shouldShowError } from "./__utils/shouldShowError";
import { shouldShowMessage } from "./__utils/shouldShowMessage";
import { DeepPath } from "./__utils/types";

export type unstable_FormMessageOptions<
  V,
  P extends DeepPath<V, P>
> = BoxOptions &
  Pick<
    unstable_FormStateReturn<V>,
    "baseId" | "touched" | "errors" | "messages"
  > & {
    /**
     * FormInput's name as in form values.
     */
    name: P;
  };

export type unstable_FormMessageHTMLProps = BoxHTMLProps;

export type unstable_FormMessageProps<
  V,
  P extends DeepPath<V, P>
> = unstable_FormMessageOptions<V, P> & unstable_FormMessageHTMLProps;

export const unstable_useFormMessage = unstable_createHook<
  unstable_FormMessageOptions<any, any>,
  unstable_FormMessageHTMLProps
>({
  name: "FormMessage",
  compose: useBox,
  useState: unstable_useFormState,
  keys: ["name"],

  useProps(options, htmlProps) {
    let children = shouldShowError(options, options.name)
      ? unstable_getIn(options.errors, options.name as any)
      : undefined;

    children =
      children ||
      (shouldShowMessage(options, options.name)
        ? unstable_getIn(options.messages, options.name as any)
        : undefined);

    return {
      role: "alert",
      id: getMessageId(options.name, options.baseId),
      children,
      ...htmlProps
    };
  }
}) as <V, P extends DeepPath<V, P>>(
  options: unstable_FormMessageOptions<V, P>,
  htmlProps?: unstable_FormMessageHTMLProps
) => unstable_FormMessageHTMLProps;

export const unstable_FormMessage = (unstable_createComponent({
  as: "div",
  useHook: unstable_useFormMessage
}) as unknown) as <V, P extends DeepPath<V, P>, T extends As = "div">(
  props: PropsWithAs<unstable_FormMessageOptions<V, P>, T>
) => JSX.Element;
