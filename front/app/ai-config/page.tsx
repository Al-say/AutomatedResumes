'use client'

import { useState, useEffect } from 'react'
import { BiSave, BiBrain, BiInfoCircle, BiTestTube } from 'react-icons/bi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import PageHeader from '@/app/components/PageHeader'

export default function AiConfigPage() {
  const [aiConfig, setAiConfig] = useState({
    introduce: '',
    prompt: '',
  })

  const [testResult, setTestResult] = useState<string>('')
  const [testing, setTesting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [enableAi, setEnableAi] = useState(0)

  // 加载AI配置
  useEffect(() => {
    fetchAiConfig()
    fetchEnableAi()
  }, [])

  const fetchAiConfig = async () => {
    try {
      const response = await fetch('http://localhost:8888/api/ai/config', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      if (result.success && result.data) {
        setAiConfig({
          introduce: result.data.introduce || '',
          prompt: result.data.prompt || '',
        })
      }
    } catch (error) {
      console.error('加载AI配置失败:', error)
      // 如果加载失败，使用默认值，不影响用户使用
      console.log('使用默认配置')
    }
  }

  // 加载 boss_config 的 enable_ai 字段
  const fetchEnableAi = async () => {
    try {
      const response = await fetch('http://localhost:8888/api/boss/config', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      const raw = result?.config?.enableAi
      const val = String(raw ?? '').trim().toLowerCase()
      setEnableAi(val === '1' || val === 'true' || val === 'on' ? 1 : Number(raw) === 1 ? 1 : 0)
    } catch (e) {
      console.error('加载enable_ai失败:', e)
    }
  }

  // 切换AI启用状态
  const toggleEnableAi = async () => {
    const newValue = enableAi === 1 ? 0 : 1
    try {
      const response = await fetch('http://localhost:8888/api/boss/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enableAi: newValue
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      if (result.success) {
        setEnableAi(newValue)
      } else {
        alert('切换AI状态失败: ' + result.message)
      }
    } catch (error) {
      console.error('切换AI状态失败:', error)
      alert('切换AI状态失败，请检查服务器连接！')
    }
  }

  // 测试智谱AI连接
  const testZhipuConnection = async () => {
    setTesting(true)
    setTestResult('')
    try {
      const response = await fetch('http://localhost:8888/api/ai/test-deepseek', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.text()
      setTestResult(result)
    } catch (error) {
      console.error('测试智谱AI连接失败:', error)
      setTestResult('连接测试失败: ' + (error instanceof Error ? error.message : '未知错误'))
    } finally {
      setTesting(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // 保存AI配置
      const response = await fetch('http://localhost:8888/api/ai/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aiConfig),
      })

      const result = await response.json()

      if (result.success) {
        alert('AI配置已保存！')
      } else {
        alert('保存失败: ' + result.message)
      }
    } catch (error) {
      console.error('保存AI配置失败:', error)
      alert('保存失败，请检查服务器连接！')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<BiBrain className="text-2xl" />}
        title="AI配置"
        subtitle="配置AI相关的技能介绍和提示词"
        iconClass="text-white"
        accentBgClass="bg-purple-500"
        actions={
          <Button
            onClick={handleSave}
            size="sm"
            className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            type="button"
            disabled={loading}
          >
            <BiSave className="mr-1" /> 保存配置
          </Button>
        }
      />

      <div className="space-y-6">
        {/* AI配置 */}
        <Card className="animate-in fade-in slide-in-from-bottom-5 duration-700">
          <CardHeader className="flex items-start gap-4">
            <div className="min-w-0 space-y-2">
              <CardTitle className="flex items-center gap-2">
                <BiBrain className="text-primary" />
                AI配置
              </CardTitle>
              <CardDescription>配置AI相关的技能介绍和提示词，用于生成个性化求职内容</CardDescription>
            </div>
            <div>
              <button
                type="button"
                aria-label="AI启用开关"
                onClick={toggleEnableAi}
                className={`relative inline-flex h-7 w-14 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400/40 border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,.25)] ${enableAi ? 'bg-emerald-500/80 hover:bg-emerald-500' : 'bg-white/10 hover:bg-white/15'}`}
              >
                <span
                  className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${enableAi ? 'translate-x-7' : 'translate-x-0'}`}
                />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="introduce">技能介绍</Label>
                <Textarea
                  id="introduce"
                  value={aiConfig.introduce}
                  onChange={(e) => setAiConfig({ ...aiConfig, introduce: e.target.value })}
                  placeholder="请输入您的技能介绍，例如：我熟练使用Java、Python等语言进行开发..."
                  className="min-h-[150px] resize-y"
                />
                <p className="text-xs text-muted-foreground">
                  详细描述您的技能、经验和专业背景，AI将使用这些信息生成个性化的求职文本
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">AI提示词</Label>
                <Textarea
                  id="prompt"
                  value={aiConfig.prompt}
                  onChange={(e) => setAiConfig({ ...aiConfig, prompt: e.target.value })}
                  placeholder="请输入AI提示词模板，例如：我目前在找工作，%s，我期望的岗位方向是【%s】..."
                  className="min-h-[150px] resize-y"
                />
                <p className="text-xs text-muted-foreground">
                  AI使用的提示词模板，支持使用 %s 作为占位符，用于动态插入内容
                </p>
              </div>

              {/* 智谱AI连接测试 */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Label>智谱AI连接测试</Label>
                  <Button
                    onClick={testZhipuConnection}
                    size="sm"
                    variant="outline"
                    disabled={testing}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
                  >
                    <BiTestTube className="mr-1" />
                    {testing ? '测试中...' : '测试连接'}
                  </Button>
                </div>
                {testResult && (
                  <div className={`p-3 rounded-md text-sm ${
                    testResult.includes('成功') 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    <pre className="whitespace-pre-wrap font-mono text-xs">{testResult}</pre>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ��用说明 */}
        <Card className="border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <BiInfoCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-foreground mb-2">
                  <strong className="font-semibold">使用说明：</strong>
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span><strong>技能介绍：</strong>用于AI了解您的专业技能、工作经验和技术背景，是生成个性化内容的基础</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span><strong>AI提示词：</strong>定义AI生成内容的模板和风格，支持使用 <code className="bg-muted px-1 py-0.5 rounded text-xs">%s</code> 作为占位符</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span><strong>效果：</strong>配置保存后，AI将在自动投递时使用这些信息生成匹配度高的求职沟通内容</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span><strong>提示：</strong>建议定期更新技能介绍以反映最新的技能和经验，提高匹配成功率</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 操作按钮（已迁移到右上角 PageHeader.actions，保持与环境配置一致） */}
      </div>
    </div>
  )
}
