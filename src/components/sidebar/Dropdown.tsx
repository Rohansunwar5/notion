'use client'
import { useAppState } from '@/lib/providers/state-provider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react'
import { AccordionContent, AccordionTrigger,AccordionItem } from '../ui/accordion';
import clsx from 'clsx';
import EmojiPicker from '../global/emoji-picker';
import { updateFolder, updateFile, createFile } from '@/lib/supabase/queries';
import { useToast } from '../ui/use-toast';
import TooltipComponent from '../global/tootltip-component';
import { PlusIcon, Trash } from 'lucide-react';
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import { v4 } from 'uuid';
import { File } from '@/lib/supabase/supabase.types';

interface DropdownProps {
  title: string;
  id: string;
  listType: 'folder' | 'file';
  iconId: string;
  children?:React.ReactNode;
  disabled?: boolean;
  
}

const Dropdown:React.FC<DropdownProps> = ({
  title,
  id,
  listType,
  iconId,
  children,
  disabled,
  ...props
}) => {

  const supabase = createClientComponentClient();
  const { state, dispatch, workspaceId, folderId } = useAppState();
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  
  //folder Title synced with server data nad local 
  const folderTitle: string | undefined = useMemo(() => {
    if(listType === 'folder') {
      const stateTitle = state.workspaces
      .find((workspace) => workspace.id === workspaceId)
      ?.folders.find((folder) => folder.id ===id)?.title;
      if(title === stateTitle || !stateTitle) return title;
      return stateTitle;
    }
  }, [state, listType, workspaceId, id, title]);

  
  // fileTitle
  const fileTitle: string | undefined = useMemo(() => {
    if(listType === 'file') {
      const fileAndFolderId = id.split('folder');
      const stateTitle = state.workspaces
      .find((workspace) => workspace.id === workspaceId)
      ?.folders.find((folder) => folder.id === fileAndFolderId[0])
      ?.files.find((file) => file.id === fileAndFolderId[1])?.title;
     if (title === stateTitle || !stateTitle) return title;
     return stateTitle;
    }
  }, [state, listType, workspaceId, id, title])

  //Naviate the user to a different page 
  const navigatePage = (accordionId: string, type: string) => {
    if(type === 'folder') {
      router.push(`/dashboard/${workspaceId}/${accordionId}`);
    }
    if(type === 'file') {
      router.push(`/dashboard/${workspaceId}/${folderId}/${accordionId}`)
    }
  };


  //add a file 

  // double click a handler 
  const handleDoubleClick = () => {
    setIsEditing(true);
  }
  //blur 
  const handleBlur = async () => {
    setIsEditing(false)
    const fId = id.split('folder');
    if(folderId?.length === 1 ){
      if(!folderTitle) return;
      await updateFolder({title}, fId[0])
    }

    if(fId.length === 2 && fId[1]){
      if(!fileTitle) return;
      //WIP UPDATE THE FILE 
    }
  }

  //onChanges 
  const onChangeEmoji = async(selectedEmoji:string) => {
    if(!workspaceId) return;
    if(listType === 'folder'){
      dispatch({
        type: 'UPDATE_FOLDER',
        payload:{
          workspaceId,
          folderId: id,
          folder: {iconId: selectedEmoji},
      },
    });
    const {data, error} = await updateFolder({
      iconId: selectedEmoji
    }, id);
    if(error){
      toast({
        title: 'Error',
        variant: 'destructive',
        description: 'Could not update the emoji for thos folder'
      });
    } else {
      toast({
        title: 'Success',
        description: 'Update emoji for the folder',
      })
    }
    }
  };

  const folderTitleChange = (e: any) => {
    if(!workspaceId) return;
    const fid = id.split('folder');
    if(fid.length === 1) {
      dispatch ({
        type: 'UPDATE_FOLDER',
        payload: {
          folder: {title:e.target.value},
          folderId: fid[0],
          workspaceId,
        }
      })
    }
  };
  const fileTitleChange = (e:any) => {
    const fid = id.split('folder');
    if(fid.length === 2 && fid[1]){
      // dispatch 
    }
  }

  //on blur 


  //move to Trash
  const isFolder = listType === 'folder';
  const groupIdentifies = clsx('dark:text-white whitespace-nowrap flex justify-between item-center w-full relative',
  {
    'group/folder': isFolder,
    'group/file': isFolder,
  }
  );
  
  const listStyles = useMemo(() => clsx('relative',{
    'border-none text-md': isFolder,
    'border-none ml-6 text-[16px] py-1': !isFolder,
  }), 
  [isFolder]
  )
  const addNewFile = async () => {
    if (!workspaceId) return;
    const newFile: File = {
      folderId: id,
      data: null,
      createdAt: new Date().toISOString(),
      inTrash: null,
      title: 'Untitled',
      iconId: '📄',
      id: v4(),
      workspaceId,
      bannerUrl: '',
    };
    dispatch({
      type: 'ADD_FILE',
      payload: { file: newFile, folderId: id, workspaceId },
    });
    const { data, error } = await createFile(newFile);
    if (error) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: 'Could not create a file',
      });
    } else {
      toast({
        title: 'Success',
        description: 'File created.',
      });
    }
  };
  const hoverStyles = useMemo(
    () =>
      clsx(
        'h-full hidden rounded-sm absolute right-0 items-center justify-center',
        {
          'group-hover/file:block': listType === 'file',
          'group-hover/folder:block': listType === 'folder',
        }
      ),
    [isFolder]
  );

  
  return (
    <AccordionItem 
    value={id} 
    className={listStyles}
    onClick={(e) => {
      e.stopPropagation();
      navigatePage(id, listType);    
    }}
    >
      <AccordionTrigger 
        id={listType}
        className='hover:no-underline p-2 dark:text-muted-foreground text-sm'
        disabled={listType === 'file'}
      >
        <div className={groupIdentifies}>
          <div className='flex gap-4 items-center justify-center overflow-hidden'>
            <div className='relative'>
              <EmojiPicker getValue={onChangeEmoji}>{iconId}</EmojiPicker>

            </div>
            <input 
              type="text"
              value={listType === 'folder' ? folderTitle : fileTitle}
              className={clsx(
                'outline-none overflow-hidden w-[140px] text-Neutrals/neutrals-7',
                {
                  'bg-muted cursor-text': isEditing,
                  'bg-transparent cursor-pointer': !isEditing,
                }
              )}
              readOnly = {!isEditing}
              onDoubleClick={handleDoubleClick}
              onBlur={handleBlur}
              onChange={listType === 'folder' ? folderTitleChange : fileTitleChange}
            />
            
          </div>
          <div className={hoverStyles}>
            <TooltipComponent message="Delete Folder">
              <Trash
                // onClick={moveToTrash}
                size={15}
                className="hover:dark:text-white dark:text-Neutrals/neutrals-7 transition-colors"
              />
            </TooltipComponent>
            {listType === 'folder' && !isEditing && (
              <TooltipComponent message="Add File">
                <PlusIcon
                  onClick={addNewFile}
                  size={15}
                  className="hover:dark:text-white dark:text-Neutrals/neutrals-7 transition-colors"
                />
              </TooltipComponent>
            )}
          </div>
          <div className='h-full hidden group-hover/file:block rounded-sm absolute right-0 items-center gap-2 justify-center'>
          <TooltipComponent message="Delete Folder">
              <Trash
                // onClick={moveToTrash}
                size={15}
                className="hover:dark:text-white dark:text-Neutrals/neutrals-7 transition-colors"
              />
            </TooltipComponent>
          {listType === 'folder' && !isEditing && (
            <TooltipComponent message ="Add File">
              <PlusIcon 
                size={15}
                className="hover:dark:text-white dark:text-Neutrals/neutrals-7 transition-colors"
              />

            </TooltipComponent>
          )}
          </div>
        </div>
      </AccordionTrigger>
    </AccordionItem>
  )
}

export default Dropdown
// 5:40