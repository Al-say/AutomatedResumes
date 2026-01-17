'use client'

import { useState, useEffect } from 'react'
import { BiPlay, BiStop, BiSearch, BiInfoCircle, BiCheckCircle, BiXCircle } from 'react-icons/bi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import PageHeader from '@/app/components/PageHeader'

interface CrawlStatus {
  boss_logged_in: boolean
  liepin_logged_in: boolean
  job51_logged_in: boolean
  zhilian_logged_in: boolean
  playwright_initialized: boolean
}

export default function CrawlConfigPage() {
  const [crawlParams, setCrawlParams] = useState({
    keyword: 'Java开发工程师',
    city: '北京',
    platforms: {
      boss: true,
      liepin: true,
      job51: true,
      zhilian: true,
    },
  })

  const [crawlStatus, setCrawlStatus] = useState<CrawlStatus | null>(null)
  const [starting, setStarting] = useState(false)
  const [stopping, setStopping] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState(false)

  // 加载爬取状态
  useEffect(() => {
    fetchCrawlStatus()
    // 每5秒更新一次状态
    const interval = setInterval(fetchCrawlStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchCrawlStatus = async () => {
    try {
      setLoadingStatus(true)
      const response = await fetch('http://localhost:8888/api/crawl/status', {
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
        setCrawlStatus(result.data)
      }
    } catch (error) {
      console.error('加载爬取状态失败:', error)
    } finally {
      setLoadingStatus(false)
    }
  }

  const startCrawling = async () => {
    try {
      setStarting(true)

      // 构建平台字符串
      const selectedPlatforms = Object.entries(crawlParams.platforms)
        .filter(([_, selected]) => selected)
        .map(([platform, _]) => platform)
        .join(',')

      if (!selectedPlatforms) {
        alert('请至少选择一个平台')
        return
      }

      const requestBody = {
        keyword: crawlParams.keyword,
        city: crawlParams.city,
        platforms: selectedPlatforms,
      }

      const response = await fetch('http://localhost:8888/api/crawl/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      if (result.success) {
        alert('爬取任务已启动！')
        fetchCrawlStatus() // 立即更新状态
      } else {
        alert(`启动失败: ${result.message}`)
      }
    } catch (error) {
      console.error('启动爬取失败:', error)
      alert('启动爬取失败，请查看控制台日志')
    } finally {
      setStarting(false)
    }
  }

  const stopCrawling = async () => {
    try {
      setStopping(true)

      const response = await fetch('http://localhost:8888/api/crawl/stop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      if (result.success) {
        alert('爬取任务已停止！')
        fetchCrawlStatus() // 立即更新状态
      } else {
        alert(`停止失败: ${result.message}`)
      }
    } catch (error) {
      console.error('停止爬取失败:', error)
      alert('停止爬取失败，请查看控制台日志')
    } finally {
      setStopping(false)
    }
  }

  const updatePlatform = (platform: string, selected: boolean) => {
    setCrawlParams(prev => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [platform]: selected,
      },
    }))
  }

  const getPlatformStatus = (platform: string) => {
    if (!crawlStatus) return null

    const loggedInKey = `${platform}_logged_in` as keyof CrawlStatus
    return crawlStatus[loggedInKey] as boolean
  }

  const getPlatformIcon = (platform: string) => {
    const isLoggedIn = getPlatformStatus(platform)
    if (isLoggedIn === null) return <BiInfoCircle className="text-gray-400" />
    return isLoggedIn ? <BiCheckCircle className="text-green-500" /> : <BiXCircle className="text-red-500" />
  }

  const getPlatformName = (platform: string) => {
    const names: { [key: string]: string } = {
      boss: 'Boss直聘',
      liepin: '猎聘',
      job51: '51job',
      zhilian: '智联招聘',
    }
    return names[platform] || platform
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title="爬取控制"
        subtitle="手动控制职位信息爬取任务，支持选择关键词、城市和平台"
        icon={<BiSearch className="w-6 h-6" />}
      />

      {/* 爬取参数配置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BiSearch className="w-5 h-5" />
            爬取参数配置
          </CardTitle>
          <CardDescription>
            设置搜索关键词、城市和目标平台
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="keyword">搜索关键词</Label>
              <Input
                id="keyword"
                value={crawlParams.keyword}
                onChange={(e) => setCrawlParams(prev => ({ ...prev, keyword: e.target.value }))}
                placeholder="例如：Java开发工程师"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">城市</Label>
              <Input
                id="city"
                value={crawlParams.city}
                onChange={(e) => setCrawlParams(prev => ({ ...prev, city: e.target.value }))}
                placeholder="例如：北京"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>目标平台</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(crawlParams.platforms).map(([platform, selected]) => (
                <div key={platform} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={platform}
                    checked={selected}
                    onChange={(e) => updatePlatform(platform, e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <Label htmlFor={platform} className="flex items-center gap-2 cursor-pointer">
                    {getPlatformIcon(platform)}
                    {getPlatformName(platform)}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 平台状态 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BiInfoCircle className="w-5 h-5" />
            平台状态
          </CardTitle>
          <CardDescription>
            当前各平台的登录状态和系统初始化状态
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingStatus ? (
            <div className="text-center py-4">加载中...</div>
          ) : crawlStatus ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-600">Boss直聘</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {getPlatformIcon('boss')}
                  <span className="text-sm">
                    {getPlatformStatus('boss') ? '已登录' : '未登录'}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">猎聘</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {getPlatformIcon('liepin')}
                  <span className="text-sm">
                    {getPlatformStatus('liepin') ? '已登录' : '未登录'}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">51job</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {getPlatformIcon('51job')}
                  <span className="text-sm">
                    {getPlatformStatus('51job') ? '已登录' : '未登录'}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">智联招聘</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {getPlatformIcon('zhilian')}
                  <span className="text-sm">
                    {getPlatformStatus('zhilian') ? '已登录' : '未登录'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">无法获取状态信息</div>
          )}
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <Card>
        <CardHeader>
          <CardTitle>操作控制</CardTitle>
          <CardDescription>
            启动或停止爬取任务
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button
            onClick={startCrawling}
            disabled={starting}
            className="flex items-center gap-2"
          >
            <BiPlay className="w-4 h-4" />
            {starting ? '启动中...' : '启动爬取'}
          </Button>
          <Button
            onClick={stopCrawling}
            disabled={stopping}
            variant="outline"
            className="flex items-center gap-2"
          >
            <BiStop className="w-4 h-4" />
            {stopping ? '停止中...' : '停止爬取'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}