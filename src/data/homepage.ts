export interface HeroAction {
  label: string;
  labelEn: string;
  href: string;
}

export interface FollowEntry {
  name: string;
  nameEn: string;
  href: string;
  description: string;
  descriptionEn: string;
  status: string;
  statusEn: string;
  actionLabel: string;
  actionLabelEn: string;
  external?: boolean;
}

export interface HeroHighlight {
  value: string;
  label: string;
}

export const homeHero = {
  greeting: '你好 我是',
  greetingEn: "Hi, I'm",
  typewriter: ['独立极客', '独立开发者', '产品创作者'],
  typewriterEn: ['IndieGeeker', 'an indie developer', 'a product maker'],
  summary:
    '持续发布有用、有趣、可立即体验的数字产品、设计资源与创意实验，帮助创作者和开发者更快开始、更顺手完成。',
  summaryEn:
    'I shape useful digital products, design resources, and creative experiments—then share the process from first idea to working release.',
  primaryAction: {
    label: '查看产品实验室',
    labelEn: 'Explore the project lab',
    href: '/project',
  } satisfies HeroAction,
};

export const featuredProductsIntro = {
  eyebrow: 'FEATURED PRODUCTS',
  title: '精选产品',
  titleEn: 'Featured products',
  description: '近期发布或持续迭代的数字产品，包含工具、设计资源与创意实验。',
  descriptionEn: 'Selected tools, design resources, and experiments at different stages of development.',
};

export const latestNotesIntro = {
  eyebrow: 'FEATURED ARTICLES',
  title: '精选文章',
  titleEn: 'Featured writing',
  description: '精选近期的构建记录与思考，涵盖产品发布、版本迭代与实验复盘。',
  descriptionEn: 'Build notes and reflections on releases, iterations, and lessons from experiments.',
};

export const miniAbout = {
  eyebrow: 'ABOUT THE MAKER',
  title: '我在做长期主义的独立产品积累',
  titleEn: 'Building an independent product practice for the long run',
  description:
    '我是独立开发者，也是偏设计驱动的产品创作者。长期围绕自我成长、创业经验和个人感悟做可持续发布，这个站既是产品入口，也是公开构建的记录。',
  descriptionEn:
    'I am an independent developer and design-led product maker. This site is both a product entry point and an honest record of what I am learning while building.',
  href: '/about',
  label: '了解更多',
  labelEn: 'More about the studio',
};

export const followSection = {
  eyebrow: 'FOLLOW CHANNELS',
  title: '了解我的最新动态',
  titleEn: 'Follow the work in progress',
  description:
    '通过以下渠道获取产品更新、设计灵感和行业资讯，及时了解最新动向。',
  descriptionEn:
    'These channels show the intended follow experience. They remain clearly marked placeholders until the official accounts are ready.',
  entries: [
    {
      name: '小红书',
      nameEn: 'RedNote',
      href: '#follow-heading',
      description: '获取产品灵感、教程和最新活动分享。',
      descriptionEn: 'Product inspiration, practical tutorials, and launch updates.',
      status: '占位中',
      statusEn: 'Placeholder',
      actionLabel: '即将开放',
      actionLabelEn: 'Coming soon',
      external: false,
    },
    {
      name: '公众号',
      nameEn: 'WeChat',
      href: '#follow-heading',
      description: '阅读深度产品文章、官方公告与行业分析。',
      descriptionEn: 'Long-form product essays, announcements, and field notes.',
      status: '占位中',
      statusEn: 'Placeholder',
      actionLabel: '即将开放',
      actionLabelEn: 'Coming soon',
    },
    {
      name: '抖音',
      nameEn: 'Douyin',
      href: '#follow-heading',
      description: '日常碎片、产品动态和幕后花絮',
      descriptionEn: 'Short build clips, product progress, and behind-the-scenes notes.',
      status: '占位中',
      statusEn: 'Placeholder',
      actionLabel: '即将开放',
      actionLabelEn: 'Coming soon',
    },
    {
      name: 'X',
      nameEn: 'X',
      href: '#follow-heading',
      description: '获取实时产品动态、活动公告和最新资讯。',
      descriptionEn: 'Fast product updates, release notes, and new experiments.',
      status: '占位中',
      statusEn: 'Placeholder',
      actionLabel: '即将开放',
      actionLabelEn: 'Coming soon',
    },
  ] satisfies FollowEntry[],
};
