'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/components/Link/Link';
import { LocaleSwitcher } from '@/components/LocaleSwitcher/LocaleSwitcher';
import { Page } from '@/components/Page';

import { DashboardComponent } from '@/components/dashboard/dashboard';

export default function Home() {
  const t = useTranslations('i18n');

  return (
    <Page back={false}>
      <LocaleSwitcher/>
      <DashboardComponent/>
    </Page>
  );
}
