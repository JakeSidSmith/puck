import {
  CSSProperties,
  MouseEventHandler,
  ReactNode,
  SyntheticEvent,
  useEffect,
} from "react";
import { Draggable, DraggableProvided } from "react-beautiful-dnd";
import styles from "./styles.module.css";
import getClassNameFactory from "../../lib/get-class-name-factory";
import { Copy, Trash } from "react-feather";
import { useModifierHeld } from "../../lib/use-modifier-held";
import { createPortal } from "react-dom";

const getClassName = getClassNameFactory("DraggableComponent", styles);

interface PortalItemProps {
  provided: DraggableProvided;
  isDragging: boolean;
  innerRef: (element: HTMLElement | null) => void;
  children?: ReactNode | readonly ReactNode[];
  className?: string;
  style?: CSSProperties;
  onMouseOver?: MouseEventHandler<HTMLDivElement>;
  onMouseOut?: MouseEventHandler<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const portalElement = document.createElement("div");
document.body.appendChild(portalElement);

const PortalItem = ({
  provided,
  innerRef,
  isDragging,
  children,
  ...props
}: PortalItemProps) => {
  const node = (
    <div
      ref={innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      {...props}
    >
      {children}
    </div>
  );

  if (isDragging) {
    return createPortal(node, portalElement);
  }

  return node;
};

export const DraggableComponent = ({
  children,
  id,
  index,
  isSelected = false,
  onClick = () => null,
  onMount = () => null,
  onMouseOver = () => null,
  onMouseOut = () => null,
  onDelete = () => null,
  onDuplicate = () => null,
  debug,
  label,
  isLocked = false,
  isDragDisabled,
  forceHover = false,
  indicativeHover = false,
  style,
}: {
  children: ReactNode;
  id: string;
  index: number;
  isSelected?: boolean;
  onClick?: (e: SyntheticEvent) => void;
  onMount?: () => void;
  onMouseOver?: (e: SyntheticEvent) => void;
  onMouseOut?: (e: SyntheticEvent) => void;
  onDelete?: (e: SyntheticEvent) => void;
  onDuplicate?: (e: SyntheticEvent) => void;
  debug?: string;
  label?: string;
  isLocked: boolean;
  isDragDisabled?: boolean;
  forceHover?: boolean;
  indicativeHover?: boolean;
  style?: CSSProperties;
}) => {
  const isModifierHeld = useModifierHeld("Alt");

  useEffect(onMount, []);

  return (
    <Draggable
      key={id}
      draggableId={id}
      index={index}
      isDragDisabled={isDragDisabled}
    >
      {(provided, snapshot) => (
        <PortalItem
          provided={provided}
          innerRef={provided.innerRef}
          isDragging={snapshot.isDragging}
          className={getClassName({
            isSelected,
            isModifierHeld,
            isDragging: snapshot.isDragging,
            isLocked,
            forceHover,
            indicativeHover,
          })}
          style={{
            ...style,
            ...provided.draggableProps.style,
            cursor: isModifierHeld ? "initial" : "grab",
          }}
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
          onClick={onClick}
        >
          {debug}
          <div className={getClassName("overlay")}>
            <div className={getClassName("actions")}>
              {label && (
                <div className={getClassName("actionsLabel")}>{label}</div>
              )}
              <button className={getClassName("action")} onClick={onDuplicate}>
                <Copy size={16} />
              </button>
              <button className={getClassName("action")} onClick={onDelete}>
                <Trash size={16} />
              </button>
            </div>
          </div>
          <div className={getClassName("contents")}>{children}</div>
        </PortalItem>
      )}
    </Draggable>
  );
};
