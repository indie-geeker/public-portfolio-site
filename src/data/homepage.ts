export interface HeroAction {
  label: string;
  href: string;
}

export interface FollowEntry {
  name: string;
  href: string;
  description: string;
  status: string;
  actionLabel: string;
  external?: boolean;
}

export interface HeroHighlight {
  value: string;
  label: string;
}

export const homeHero = {
  greeting: '你好 我是',
  typewriter: ['独立极客', '独立开发者', '产品创作者'],
  summary:
    '持续发布有用、有趣、可立即体验的数字产品、设计资源与创意实验，帮助创作者和开发者更快开始、更顺手完成。',
  primaryAction: {
    label: '关于我',
    href: '/about',
  } satisfies HeroAction,
};

export const featuredProductsIntro = {
  eyebrow: 'FEATURED PRODUCTS',
  title: '精选产品',
  description: '近期发布或持续迭代的数字产品，包含工具、设计资源与创意实验。',
};

export const latestNotesIntro = {
  eyebrow: 'FEATURED ARTICLES',
  title: '精选文章',
  description: '精选近期的构建记录与思考，涵盖产品发布、版本迭代与实验复盘。',
};

export const miniAbout = {
  eyebrow: 'ABOUT THE MAKER',
  title: '我在做长期主义的独立产品积累',
  description:
    '我是独立开发者，也是偏设计驱动的产品创作者。长期围绕自我成长、创业经验和个人感悟做可持续发布，这个站既是产品入口，也是公开构建的记录。',
  href: '/about',
  label: '了解更多',
};

export const followSection = {
  eyebrow: 'FOLLOW CHANNELS',
  title: '了解我的最新动态',
  description:
    '通过以下渠道获取产品更新、设计灵感和行业资讯，及时了解最新动向。',
  entries: [
    {
      name: '小红书',
      href: '#follow-heading',
      description: '获取产品灵感、教程和最新活动分享。',
      status: '占位中',
      actionLabel: '即将开放',
      external: false,
    },
    {
      name: '公众号',
      href: '#follow-heading',
      description: '阅读深度产品文章、官方公告与行业分析。',
      status: '占位中',
      actionLabel: '即将开放',
    },
    {
      name: '抖音',
      href: '#follow-heading',
      description: '日常碎片、产品动态和幕后花絮',
      status: '占位中',
      actionLabel: '即将开放',
    },
    {
      name: 'X',
      href: '#follow-heading',
      description: '获取实时产品动态、活动公告和最新资讯。',
      status: '占位中',
      actionLabel: '即将开放',
    },
  ] satisfies FollowEntry[],
};
