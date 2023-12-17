import Link from 'next/link';
import React from 'react'
import { twMerge } from 'tailwind-merge';
import CypressHomeIcon from '../icons/cypressHomeIcon';

interface NativeNavigationProps {
  myWorkspaceId: string;
  className?: string;
  // getSelectedElement?: (selection: string) => void;
}

const NativeNavigation:React.FC<NativeNavigationProps> = ({
  myWorkspaceId,
  className,
}) => {
  return (
    <nav className={twMerge('my-2', className)}>
      <ul>
        <li>
          <Link className="group/native flex text-Neutrals/neutrals-7 transition-all"
          href={`/dashboard/${myWorkspaceId}`}
        
          >
            <CypressHomeIcon/>
            <span> My Workspace</span>
          </Link>
          
        </li>
      </ul>
    </nav>
  )
}

export default NativeNavigation