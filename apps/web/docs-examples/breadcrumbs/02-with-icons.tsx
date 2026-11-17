'use client';
// @example {"title":"With icons","description":"Each item can carry an icon before its label."}
import Home from '@mui/icons-material/HomeOutlined';
import Folder from '@mui/icons-material/FolderOutlined';
import Description from '@mui/icons-material/DescriptionOutlined';
import { Breadcrumbs } from '@sorbet-ui/react';

export default function WithIcons() {
  return (
    <Breadcrumbs
      aria-label="File path"
      items={[
        { id: 'home', label: 'Home', href: '/', icon: <Home /> },
        { id: 'projects', label: 'Projects', href: '/docs', icon: <Folder /> },
        { id: 'readme', label: 'README.md', icon: <Description /> },
      ]}
    />
  );
}
