import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SurveyService } from '../survey/survey.service';

const surveys = [
  {
    id: '1',
    creator: 'Vaklabs',
    title: 'DefiModel',
    description: 'training defi model',
    startDate: '2025-03-01T00:00:00Z',
    endDate: '2025-03-01T00:00:00Z',
  },
];

const questions = [
  {
    id: '1',
    section: '基本信息',
    type: 'single_choice',
    question: '您的区块链投资经验',
    options: ['1年以内', '1-3年', '3年以上'],
    required: false,
  },
  {
    id: '2',
    section: '基本信息',
    type: 'multi_choice',
    question: '您主要关注的链',
    options: ['BSC', 'ETH', 'Polygon'],
    required: false,
  },
  {
    id: '3',
    section: '关于大户持仓识别',
    type: 'multi_choice',
    question: '您通常如何查询一个代币的Top大户持仓分布？',
    options: [
      '区块链浏览器（如BSCScan）',
      'API工具（如BSCScan API、Tokenview等）',
      '第三方分析平台（如Dune、Bitquery等）',
    ],
    required: true,
  },
  {
    id: '4',
    section: '关于大户持仓识别',
    type: 'text',
    question: '您最常用的持仓分布查询工具/平台是？',
    options: [],
    required: true,
  },
  {
    id: '5',
    section: '关于大户持仓识别',
    type: 'multi_choice',
    question: '在查看Top持仓时，您最关注哪些信息？',
    options: [
      '地址排名',
      '持有数量',
      '持有比例',
      '地址标签（如CEX、DEX、合约、未知等）',
      '持仓变化历史',
    ],
    required: true,
  },
  {
    id: '6',
    section: '关于大户持仓识别',
    type: 'text',
    question:
      '您会如何判断某个地址是否为“真实大户”而非流动性池、锁仓合约等？（开放回答）您可以点击下面的语言按钮，支持语音录入:',
    options: [],
    required: true,
  },
  {
    id: '7',
    section: '关于大户持仓识别',
    type: 'text',
    question:
      '您是否会对大户地址进行聚类分析（如同一用户分散多个地址）？如有，请简述您的方法或用到的工具。',
    options: [],
    required: true,
  },
  {
    id: '8',
    section: '关于老鼠仓识别',
    type: 'multi_choice',
    question: '您如何判断一个代币是否存在老鼠仓/项目方暗箱操作？',
    options: [
      '分析上线初期大额买入',
      '追踪合约部署者/项目方地址及关联地址',
      '观察频繁小额分批买入',
      '使用自动化检测工具(如ScamSniffer等)',
    ],
    required: true,
  },
  {
    id: '9',
    section: '关于老鼠仓识别',
    type: 'text',
    question: '您最常用的老鼠仓识别工具/平台是？',
    options: [],
    required: true,
  },
  {
    id: '10',
    section: '关于老鼠仓识别',
    type: 'text',
    question:
      '您能否分享一个您实际遇到或分析过的老鼠仓案例？（请描述过程和结论）（开放回答）您可以点击下面的语言按钮，支持语音录入',
    options: [],
    required: true,
  },
  {
    id: '11',
    section: '关于风险判断与能否购买',
    type: 'multi_choice',
    question: '您在判断一个币“能不能买”时，最看重哪些风险指标？',
    options: [
      '持仓集中度（如前10地址持有比例）',
      '合约安全性（如owner权限、黑名单等）',
      '流动性池情况（是否锁定、是否充足）',
      '上线时间与交易活跃度',
      '项目方/团队透明度',
      '社区/第三方平台口碑',
    ],
    required: true,
  },
  {
    id: '12',
    section: '关于风险判断与能否购买',
    type: 'single_choice',
    question: '您是否使用过一键风险检测工具？（如TokenSniffer、DappBay等）',
    options: ['经常使用', '偶尔使用', '很少/从不使用'],
    required: true,
  },
  {
    id: '13',
    section: '关于风险判断与能否购买',
    type: 'text',
    question: '您最信任的风险检测工具/平台是？',
    options: [],
    required: true,
  },
  {
    id: '14',
    section: '关于风险判断与能否购买',
    type: 'multi_choice',
    question: '您认为哪些典型信号最能说明“高风险，不能买”？',
    options: [
      '前10地址持仓>80%',
      'owner权限未放弃',
      '合约可随意增发/销毁',
      '交易有黑名单/白名单限制',
      '流动性池未锁定或被owner控制',
      '新币上线即大额买入/卖出',
      '社区/第三方有负面记录',
    ],
    required: true,
  },
  {
    id: '15',
    section: '关于风险判断与能否购买',
    type: 'text',
    question:
      '您能否分享一次您通过风险分析避免损失或踩雷的经历？（可选，开放回答）',
    options: [],
    required: false,
  },
  {
    id: '16',
    section: '理想的自动化分析工具',
    type: 'multi_choice',
    question: '如果有一个“一键分析”工具，您最希望它自动输出哪些内容？',
    options: [
      'Top10持仓分布',
      '合约安全性检测',
      '流动性池分析',
      '上线时间与交易活跃度',
      '社区/第三方风险标签',
      '风险评级与投资建议',
    ],
    required: true,
  },
  {
    id: '17',
    section: '理想的自动化分析工具',
    type: 'multi_choice',
    question: '您希望分析结果以什么形式呈现？',
    options: ['简明文字报告', '图表/可视化', '风险打分/评级', '详细数据下载'],
    required: true,
  },
  {
    id: '18',
    section: '理想的自动化分析工具',
    type: 'text',
    question:
      '您对自动化分析工具还有哪些建议或期待？（开放回答）（开放回答）您可以点击下面的语言按钮，支持语音录入',
    options: [],
    required: false,
  },
  {
    id: '19',
    section: '补充与建议',
    type: 'text',
    question:
      '您还有哪些关于大户持仓、老鼠仓识别、风险判断的经验、技巧或建议，愿意分享给Vaklabs知识库？（开放回答）您可以点击下面的语言按钮，支持语音录入',
    options: [],
    required: false,
  },
  {
    id: '20',
    section: '关于 Telegram 上的相关工具与服务',
    type: 'single_choice',
    question:
      '您是否在 Telegram 上使用过与代币分析、大户监控、风险检测等相关的Bot或工具？',
    options: ['经常使用', '偶尔使用', '很少/从不使用'],
    required: true,
  },
  {
    id: '21',
    section: '关于 Telegram 上的相关工具与服务',
    type: 'text',
    question:
      '您用过哪些 Telegram Bot 或频道来获取代币持仓、老鼠仓、风险等信息？（请填写具体Bot名称或频道名）',
    options: [],
    required: false,
  },
  {
    id: '22',
    section: '关于 Telegram 上的相关工具与服务',
    type: 'multi_choice',
    question: '您觉得这些 Telegram 工具/服务的哪些功能最有用？',
    options: [
      '实时大户异动推送',
      '一键查询持仓分布',
      '合约安全检测',
      '风险评级/预警',
      '新币上线监控',
    ],
    required: false,
  },
  {
    id: '23',
    section: '关于 Telegram 上的相关工具与服务',
    type: 'multi_choice',
    question: '您在使用这些 Telegram 工具/服务时，遇到过哪些问题或不便？',
    options: [
      '数据不准确/延迟',
      '功能不全/不易用',
      '付费门槛高',
      '消息太多/噪音大',
      '隐私/安全担忧',
    ],
    required: false,
  },
  {
    id: '24',
    section: '关于 Telegram 上的相关工具与服务',
    type: 'text',
    question:
      '您最希望 Telegram 上的相关Bot/服务增加哪些新功能或改进？（开放回答）您可以点击下面的语言按钮，支持语音录入',
    options: [],
    required: false,
  },
  {
    id: '25',
    section: '关于 Telegram 上的相关工具与服务',
    type: 'single_choice',
    question: '您是否愿意为更好用的 Telegram Bot/服务付费？',
    options: ['愿意', '视功能而定', '不愿意'],
    required: true,
  },
  {
    id: '26',
    section: '关于 Telegram 上的相关工具与服务',
    type: 'text',
    question:
      '您是否愿意将自己在 Telegram 上的使用经验、踩坑经历、优质Bot推荐等分享给Vaklabs知识库？（开放回答）您可以点击下面的语言按钮，支持语音录入',
    options: [],
    required: false,
  },
  {
    id: '27',
    section: '补充与建议',
    type: 'text',
    question:
      '感谢您的补充反馈！您的意见将帮助Vaklabs更好地服务Telegram用户，完善相关工具和知识库。',
    options: [],
    required: false,
  },
];

const survey_questions = [
  {
    id: '1',
    surveyId: '1',
    questionId: '1',
  },
  {
    id: '2',
    surveyId: '1',
    questionId: '2',
  },
  {
    id: '3',
    surveyId: '1',
    questionId: '3',
  },
  {
    id: '4',
    surveyId: '1',
    questionId: '4',
  },
  {
    id: '5',
    surveyId: '1',
    questionId: '5',
  },
  {
    id: '6',
    surveyId: '1',
    questionId: '6',
  },
  {
    id: '7',
    surveyId: '1',
    questionId: '7',
  },
  {
    id: '8',
    surveyId: '1',
    questionId: '8',
  },
  {
    id: '9',
    surveyId: '1',
    questionId: '9',
  },
  {
    id: '10',
    surveyId: '1',
    questionId: '10',
  },
  {
    id: '11',
    surveyId: '1',
    questionId: '11',
  },
  {
    id: '12',
    surveyId: '1',
    questionId: '12',
  },
  {
    id: '13',
    surveyId: '1',
    questionId: '13',
  },
  {
    surveyId: '1',
    questionId: '14',
  },
  {
    id: '15',
    surveyId: '1',
    questionId: '15',
  },
  {
    id: '16',
    surveyId: '1',
    questionId: '16',
  },
  {
    id: '17',
    surveyId: '1',
    questionId: '17',
  },
  {
    id: '18',
    surveyId: '1',
    questionId: '18',
  },
  {
    id: '19',
    surveyId: '1',
    questionId: '19',
  },
  {
    id: '20',
    surveyId: '1',
    questionId: '20',
  },
  {
    id: '21',
    surveyId: '1',
    questionId: '21',
  },
  {
    id: '22',
    surveyId: '1',
    questionId: '22',
  },
  {
    id: '23',
    surveyId: '1',
    questionId: '23',
  },
  {
    id: '24',
    surveyId: '1',
    questionId: '24',
  },
  {
    id: '25',
    surveyId: '1',
    questionId: '25',
  },
  {
    id: '26',
    surveyId: '1',
    questionId: '26',
  },
  {
    id: '27',
    surveyId: '1',
    questionId: '27',
  },
];

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const surveyService = app.get(SurveyService);
  await surveyService.seed(questions, surveys, survey_questions);

  await app.close();
}
bootstrap();
