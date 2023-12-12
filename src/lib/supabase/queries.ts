'use server';
import { and, eq, ilike, notExists } from "drizzle-orm";
import { validate } from 'uuid';
import db from "./db"
import { files, folders, workspaces } from "./schema";
// import { Subscription, workspace } from "./supabase.types";
import { File, Folder, Subscription, User, Workspace } from './supabase.types';

export const getUserSubscriptionStatus = async (userId: string) => {
  try{
    const data = await db.query.subscriptions.findFirst({
      where: (s, {eq}) => eq(s.userId, userId),
    });
    if(data) return { data: data as Subscription, error: null};
    else return {data: null, error: null};
  } catch (error) {
    console.log(error);
    return {data:null, error: `Error ${error}`};
  }
}
export const createWorkspace = async (workspace: Workspace) => {
  try {
    const response = await db.insert(workspaces).values(workspace);
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: 'Error' };
  }
};

export const getFolders = async (workspaceId: string)=>{
  const isValid = validate(workspaceId);
  if(!isValid) return {
    data:null,
    error: "Error",
  }

  try {
    const results: Folder[] | []  = await db
    .select()
    .from(folders)
    .orderBy(folders.createdAt)
    .where(eq(folders.workspaceId, workspaceId));
    return { data: results, error: null };
  } catch (error){
    return { data: null, error: 'Error' };
  }
}
