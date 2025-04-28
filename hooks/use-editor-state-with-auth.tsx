"use client";

import { useEditorState } from './use-editor-state';
import { useSocket } from './use-socket';
import { useSession } from 'next-auth/react';
import { useEffect, useCallback } from 'react';

export function useEditorStateWithAuth(editorId: string, initialElements = []) {
  const { data: session } = useSession();
  const editorState = useEditorState(initialElements);
  const { emitElementUpdate, subscribeToElementUpdates } = useSocket(editorId);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!session) return;

    const unsubscribe = subscribeToElementUpdates((elementData) => {
      if (elementData.userId !== session.user.id) {
        editorState.updateElement(elementData.id, elementData.props, false);
      }
    });

    return () => unsubscribe();
  }, [session, editorState, subscribeToElementUpdates]);

  // Wrap updateElement to emit changes
  const updateElementWithSync = useCallback(
    (id: string, newProps: any, addToHistoryFlag = false) => {
      if (session) {
        editorState.updateElement(id, newProps, addToHistoryFlag);
        emitElementUpdate({
          id,
          props: newProps,
          userId: session.user.id,
        });
      }
    },
    [session, editorState, emitElementUpdate]
  );

  return {
    ...editorState,
    updateElement: updateElementWithSync,
    isAuthenticated: !!session,
    user: session?.user,
  };
}