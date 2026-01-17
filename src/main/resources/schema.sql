-- GetJobs 数据库初始化脚本
-- 适用于 SQLite 数据库

-- ========================================
-- Cookie表：存储各平台的登录Cookie
-- ========================================
CREATE TABLE IF NOT EXISTS cookie (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform TEXT NOT NULL,           -- 平台名称: boss/zhilian/job51/liepin
    cookie_value TEXT,                -- Cookie值
    remark TEXT,                      -- 备注
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- Config表：通用配置存储
-- ========================================
CREATE TABLE IF NOT EXISTS config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    config_key TEXT NOT NULL UNIQUE,  -- 配置键
    config_value TEXT,                -- 配置值
    config_type TEXT,                 -- 配置类型
    category TEXT,                    -- 分类
    description TEXT,                 -- 描述
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- AI表：AI配置
-- ========================================
CREATE TABLE IF NOT EXISTS ai (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    introduce TEXT,                   -- 技能介绍
    prompt TEXT,                      -- AI提示词
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- Boss黑名单表
-- ========================================
CREATE TABLE IF NOT EXISTS boss_blacklist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,               -- 类型: company/recruiter/job
    value TEXT NOT NULL,              -- 黑名单值
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- Boss配置表
-- ========================================
CREATE TABLE IF NOT EXISTS boss_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    debugger INTEGER DEFAULT 0,       -- 调试模式
    wait_time INTEGER DEFAULT 3,      -- 等待时间(秒)
    keywords TEXT,                    -- 搜索关键词
    city_code TEXT,                   -- 城市
    industry TEXT,                    -- 行业
    job_type TEXT,                    -- 职位类型
    experience TEXT,                  -- 工作经验
    degree TEXT,                      -- 学历要求
    salary TEXT,                      -- 薪资区间
    scale TEXT,                       -- 公司规模
    stage TEXT,                       -- 融资阶段
    say_hi TEXT DEFAULT '您好，我对贵公司的岗位很感兴趣，期待与您进一步沟通！',
    expected_salary_min INTEGER,      -- 期望薪资下限
    expected_salary_max INTEGER,      -- 期望薪资上限
    enable_ai INTEGER DEFAULT 0,      -- 是否启用AI
    send_img_resume INTEGER DEFAULT 0,-- 是否发送图片简历
    filter_dead_hr INTEGER DEFAULT 1, -- 是否过滤不在线HR
    dead_status TEXT,                 -- HR不在线状态列表
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- Boss选项表：城市/行业/经验/学历等选项
-- ========================================
CREATE TABLE IF NOT EXISTS boss_option (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,               -- 选项类型: city/industry/experience/jobType/salary/degree/scale/stage
    name TEXT NOT NULL,               -- 选项名称
    code TEXT NOT NULL,               -- 选项代码
    sort_order INTEGER DEFAULT 999,   -- 排序
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- Boss行业表
-- ========================================
CREATE TABLE IF NOT EXISTS boss_industry (
    code INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- Boss岗位数据表
-- ========================================
CREATE TABLE IF NOT EXISTS boss_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    encrypt_id TEXT,
    encrypt_user_id TEXT,
    company_name TEXT,
    job_name TEXT,
    salary TEXT,
    location TEXT,
    experience TEXT,
    degree TEXT,
    hr_name TEXT,
    hr_position TEXT,
    hr_active_status TEXT,
    delivery_status TEXT DEFAULT '未投递',
    job_description TEXT,
    job_url TEXT,
    recruitment_status TEXT,
    company_address TEXT,
    industry TEXT,
    introduce TEXT,
    financing_stage TEXT,
    company_scale TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 智联配置表
-- ========================================
CREATE TABLE IF NOT EXISTS zhilian_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    debugger INTEGER DEFAULT 0,
    wait_time INTEGER DEFAULT 3,
    keywords TEXT,
    city_code TEXT,
    salary TEXT,
    education TEXT,
    experience TEXT,
    job_type TEXT,
    company_size TEXT,
    company_type TEXT,
    say_hi TEXT,
    enable_ai INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 智联选项表
-- ========================================
CREATE TABLE IF NOT EXISTS zhilian_option (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    sort_order INTEGER DEFAULT 999,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 智联岗位数据表
-- ========================================
CREATE TABLE IF NOT EXISTS zhilian_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id TEXT,
    company_name TEXT,
    job_name TEXT,
    salary TEXT,
    location TEXT,
    experience TEXT,
    education TEXT,
    company_size TEXT,
    company_type TEXT,
    job_description TEXT,
    job_url TEXT,
    delivery_status TEXT DEFAULT '未投递',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 猎聘配置表
-- ========================================
CREATE TABLE IF NOT EXISTS liepin_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    debugger INTEGER DEFAULT 0,
    wait_time INTEGER DEFAULT 3,
    keywords TEXT,
    city_code TEXT,
    salary TEXT,
    education TEXT,
    experience TEXT,
    industry TEXT,
    company_size TEXT,
    say_hi TEXT,
    enable_ai INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 猎聘选项表
-- ========================================
CREATE TABLE IF NOT EXISTS liepin_option (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    sort_order INTEGER DEFAULT 999,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 猎聘岗位数据表
-- ========================================
CREATE TABLE IF NOT EXISTS liepin_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id TEXT,
    company_name TEXT,
    job_name TEXT,
    salary TEXT,
    location TEXT,
    experience TEXT,
    education TEXT,
    company_size TEXT,
    industry TEXT,
    job_description TEXT,
    job_url TEXT,
    delivery_status TEXT DEFAULT '未投递',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 51Job配置表
-- ========================================
CREATE TABLE IF NOT EXISTS job51_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    debugger INTEGER DEFAULT 0,
    wait_time INTEGER DEFAULT 3,
    keywords TEXT,
    job_area TEXT,
    salary TEXT,
    education TEXT,
    experience TEXT,
    company_size TEXT,
    company_type TEXT,
    say_hi TEXT,
    enable_ai INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 51Job选项表
-- ========================================
CREATE TABLE IF NOT EXISTS job51_option (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,               -- 选项类型: jobArea/salary/education/experience/company_size/company_type
    name TEXT NOT NULL,               -- 选项名称
    code TEXT NOT NULL,               -- 选项代码
    sort_order INTEGER DEFAULT 999,   -- 排序
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 51Job岗位数据表
-- ========================================
CREATE TABLE IF NOT EXISTS job51_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id TEXT,
    company_name TEXT,
    job_name TEXT,
    salary TEXT,
    location TEXT,
    experience TEXT,
    education TEXT,
    company_size TEXT,
    company_type TEXT,
    job_description TEXT,
    job_url TEXT,
    welfare TEXT,
    delivery_status TEXT DEFAULT '未投递',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 创建索引以提升查询性能
-- ========================================

-- Cookie表索引
CREATE INDEX IF NOT EXISTS idx_cookie_platform ON cookie(platform);

-- Config表索引
CREATE INDEX IF NOT EXISTS idx_config_key ON config(config_key);
CREATE INDEX IF NOT EXISTS idx_config_category ON config(category);

-- Boss相关索引
CREATE INDEX IF NOT EXISTS idx_boss_option_type ON boss_option(type);
CREATE INDEX IF NOT EXISTS idx_boss_data_encrypt_id ON boss_data(encrypt_id);
CREATE INDEX IF NOT EXISTS idx_boss_data_delivery_status ON boss_data(delivery_status);
CREATE INDEX IF NOT EXISTS idx_boss_data_created_at ON boss_data(created_at);
CREATE INDEX IF NOT EXISTS idx_boss_blacklist_type ON boss_blacklist(type);

-- 智联相关索引
CREATE INDEX IF NOT EXISTS idx_zhilian_option_type ON zhilian_option(type);
CREATE INDEX IF NOT EXISTS idx_zhilian_data_job_id ON zhilian_data(job_id);
CREATE INDEX IF NOT EXISTS idx_zhilian_data_delivery_status ON zhilian_data(delivery_status);

-- 猎聘相关索引
CREATE INDEX IF NOT EXISTS idx_liepin_option_type ON liepin_option(type);
CREATE INDEX IF NOT EXISTS idx_liepin_data_job_id ON liepin_data(job_id);
CREATE INDEX IF NOT EXISTS idx_liepin_data_delivery_status ON liepin_data(delivery_status);

-- 51Job相关索引
CREATE INDEX IF NOT EXISTS idx_job51_option_type ON job51_option(type);
CREATE INDEX IF NOT EXISTS idx_job51_data_job_id ON job51_data(job_id);
CREATE INDEX IF NOT EXISTS idx_job51_data_delivery_status ON job51_data(delivery_status);

-- ========================================
-- 插入默认配置数据
-- ========================================

-- 插入默认Boss配置
INSERT OR IGNORE INTO boss_config (id, keywords, city_code, say_hi, filter_dead_hr)
VALUES (1, '["Java开发"]', '北京', '您好，我对贵公司的岗位很感兴趣，期待与您进一步沟通！', 1);

-- 插入默认AI配置
INSERT OR IGNORE INTO ai (id, introduce, prompt)
VALUES (1, 
    '熟悉Java/Python开发，了解主流框架Spring Boot/Django，具有良好的编程习惯和团队协作能力。',
    '你是一个求职助手，请根据岗位信息生成一段简短、专业的求职打招呼语。要求：1. 简洁明了，不超过100字；2. 体现对岗位的兴趣；3. 语气礼貌专业。'
);

-- 插入Boss选项默认数据（不限选项）
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('city', '不限', '0', 0);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('industry', '不限', '0', 0);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('experience', '不限', '0', 0);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('degree', '不限', '0', 0);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('salary', '不限', '0', 0);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('scale', '不限', '0', 0);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('stage', '不限', '0', 0);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('jobType', '不限', '0', 0);

-- ========================================
-- AI配置默认数据
-- ========================================
-- DeepSeek API 配置（请替换为您自己的API密钥）
INSERT OR IGNORE INTO config (config_key, config_value, config_type, category, description)
VALUES ('BASE_URL', 'https://api.deepseek.com/v1', 'string', 'ai', 'AI API基础URL');

INSERT OR IGNORE INTO config (config_key, config_value, config_type, category, description)
VALUES ('API_KEY', '', 'string', 'ai', 'AI API密钥（请配置您的API Key）');

INSERT OR IGNORE INTO config (config_key, config_value, config_type, category, description)
VALUES ('MODEL', 'deepseek-chat', 'string', 'ai', 'AI模型名称');

-- AI自我介绍和提示词默认配置
INSERT OR IGNORE INTO ai (id, introduce, prompt)
VALUES (1, 
'我是一名有丰富经验的求职者，具备良好的技术能力和沟通能力。',
'你是一个求职助手，帮助用户根据职位描述生成合适的打招呼消息。请生成简洁、专业、友好的消息，不超过100字。如果职位不匹配，返回 false。');

-- 常用城市
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('city', '北京', '101010100', 1);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('city', '上海', '101020100', 2);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('city', '广州', '101280100', 3);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('city', '深圳', '101280600', 4);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('city', '杭州', '101210100', 5);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('city', '成都', '101270100', 6);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('city', '南京', '101190100', 7);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('city', '武汉', '101200100', 8);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('city', '西安', '101110100', 9);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('city', '苏州', '101190400', 10);

-- 工作经验
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('experience', '应届生', '108', 1);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('experience', '1年以内', '101', 2);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('experience', '1-3年', '102', 3);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('experience', '3-5年', '103', 4);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('experience', '5-10年', '104', 5);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('experience', '10年以上', '105', 6);

-- 学历要求
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('degree', '初中及以下', '209', 1);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('degree', '中专/中技', '208', 2);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('degree', '高中', '206', 3);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('degree', '大专', '202', 4);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('degree', '本科', '203', 5);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('degree', '硕士', '204', 6);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('degree', '博士', '205', 7);

-- 薪资区间
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('salary', '3K以下', '401', 1);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('salary', '3-5K', '402', 2);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('salary', '5-10K', '403', 3);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('salary', '10-15K', '404', 4);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('salary', '15-20K', '405', 5);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('salary', '20-30K', '406', 6);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('salary', '30-50K', '407', 7);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('salary', '50K以上', '408', 8);

-- 公司规模
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('scale', '0-20人', '301', 1);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('scale', '20-99人', '302', 2);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('scale', '100-499人', '303', 3);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('scale', '500-999人', '304', 4);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('scale', '1000-9999人', '305', 5);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('scale', '10000人以上', '306', 6);

-- 融资阶段
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('stage', '未融资', '801', 1);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('stage', '天使轮', '802', 2);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('stage', 'A轮', '803', 3);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('stage', 'B轮', '804', 4);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('stage', 'C轮', '805', 5);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('stage', 'D轮及以上', '806', 6);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('stage', '已上市', '807', 7);
INSERT OR IGNORE INTO boss_option (type, name, code, sort_order) VALUES ('stage', '不需要融资', '808', 8);

-- 51Job 相关默认数据
INSERT OR IGNORE INTO job51_config (id, keywords, job_area, salary, say_hi, enable_ai)
VALUES (1, '["Java开发"]', '["不限"]', '["不限"]', '您好，我对贵公司的岗位很感兴趣，期待与您进一步沟通！', 0);

INSERT OR IGNORE INTO job51_option (type, name, code, sort_order) VALUES ('jobArea', '不限', '0', 0);
INSERT OR IGNORE INTO job51_option (type, name, code, sort_order) VALUES ('salary', '不限', '0', 0);

PRAGMA optimize;
