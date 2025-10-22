import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const KPIRelationDiagram = () => {
  const svgRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const kpiStructure = {
    "頻度・継続性": {
      color: "#DBEAFE",
      subcategories: {
        "ログイン・起動": {
          metrics: [
            { behavior: "アプリ起動頻度/ログイン頻度", outcome: ["DAU/MAU比率", "MAU", "DAU"] },
            { behavior: "週間ログイン日数", outcome: ["DAU/MAU比率", "全体7日継続率", "MAU", "DAU"] },
            { behavior: "アプリの滞留時間", outcome: ["MAU", "DAU"] },
          ]
        },
        "視聴頻度": {
          metrics: [
            { behavior: "1日あたり平均視聴回数", outcome: ["DAU/MAU比率", "MAU", "DAU"] },
            { behavior: "視聴頻度(日/週/月)", outcome: ["DAU/MAU比率", "MAU","DAU", "ローリング30日視聴者数"] },
            { behavior: "月間平均視聴セッション数", outcome: ["MAU", "DAU", "ローリング30日視聴者数"] },
            { behavior: "1ヶ月での視聴日数", outcome: ["MAU", "月次継続率"] },
            { behavior: "直近1週間でのアプリ使用頻度", outcome: ["DAU/MAU比率", "翌日継続率"] },
          ]
        },
        "通知反応": {
          metrics: [
            { behavior: "通知クリック数", outcome: ["DAU/MAU比率", "MAU", "DAU", "カムバックユーザー率"] },
            { behavior: "ライブ通知から○分以内の起動率", outcome: ["DAU/MAU比率",  "MAU", "DAU", "カムバックユーザー率"] },
            { behavior: "プッシュ通知への反応速度", outcome: ["DAU/MAU比率",  "MAU", "DAU", "カムバックユーザー率"] },
            { behavior: "通知クリック率/リマインダー利用率", outcome: ["DAU/MAU比率",  "MAU", "DAU", "カムバックユーザー率"] },
            { behavior: "推し配信者の通知受信ON率", outcome: ["DAU/MAU比率",  "MAU", "DAU", "翌日継続率"] },
            { behavior: "アプリ起動理由(通知/自発/ディープリンク)の割合", outcome: ["カムバックユーザー率", "DAU/MAU比率",  "MAU", "DAU"] },
          ]
        },
      }
    },
    "深度・エンゲージメント": {
      color: "#D1FAE5",
      subcategories: {
        "視聴時間・滞在": {
          metrics: [
            { behavior: "そのリスナーの1日における全視聴時間", outcome: ["DAU/MAU比率", "MAU", "DAU"] },
            { behavior: "利用時間", outcome: ["DAU/MAU比率", "MAU", "DAU"] },
            { behavior: "平均視聴時間", outcome: ["DAU/MAU比率",  "MAU", "DAU", "新規ユーザー初日視聴率"] },
            { behavior: "同時視聴時間", outcome: ["DAU/MAU比率",  "MAU", "DAU", "新規ユーザー初日視聴率"] },
            { behavior: "新規視聴時の視聴時間", outcome: ["推しライバー発見率", "ライバーマッチング数"] },
            { behavior: "推しライバー毎の平均視聴時間", outcome: ["継続ギフティング率", "エンゲージメントファネル"] },
            { behavior: "視聴時間あたりギフト額(効率的応援度)", outcome: ["課金者ARPPU", "消費者ARPPU", "継続ギフティング率"] },
          ]
        },
        "インタラクション": {
          metrics: [
            { behavior: "コメント数", outcome: ["エンゲージメントファネル", "DAU/MAU比率", "MAU", "DAU"] },
            { behavior: "1セッションあたりコメント数", outcome: ["エンゲージメントファネル", "DAU/MAU比率", "MAU", "DAU"] },
            { behavior: "コメント投稿頻度", outcome: ["エンゲージメントファネル", "DAU/MAU比率", "MAU", "DAU"] },
            { behavior: "コメント文字数の平均", outcome: ["エンゲージメントファネル"] },
            { behavior: "コメント投稿先の配信者数", outcome: ["エンゲージメントファネル", "DAU/MAU比率", "MAU", "DAU"] },
            { behavior: "リアクション使用率(いいね、スタンプ等)", outcome: ["エンゲージメントファネル", "DAU/MAU比率",  "MAU", "DAU"] },
            { behavior: "1配信あたりの平均エンゲージメント数", outcome: ["エンゲージメントファネル", "DAU/MAU比率",  "MAU", "DAU"] },
            { behavior: "視聴中の画面注視率", outcome: ["エンゲージメントファネル", "DAU/MAU比率",  "MAU", "DAU"] },
          ]
        },
        "機能利用": {
          metrics: [
            { behavior: "アプリの機能数に対するユーザーが使用している機能数", outcome: ["DAU/MAU比率",  "MAU", "DAU", "エンゲージメントファネル"] },
            { behavior: "利用機能数", outcome: ["DAU/MAU比率",  "MAU", "DAU", "新規ユーザー7日継続率"] },
          ]
        },
      }
    },
    "広さ・多様性": {
      color: "#E9D5FF",
      subcategories: {
        "ライバー関係": {
          metrics: [
            { behavior: "日常的に視聴するライバー数", outcome: ["DAU/MAU比率",  "MAU", "DAU", "全体7日継続率"] },
            { behavior: "フォローしている配信者数", outcome: ["DAU/MAU比率",  "MAU", "DAU", "月次継続率"] },
            { behavior: "視聴した配信者のユニーク数", outcome: ["月次継続率", "全体7日継続率"] },
            { behavior: "ライバー毎の連続視聴回数", outcome: ["全体7日継続率", "月次継続率"] },
            { behavior: "視聴するライバーレベルの幅", outcome: ["月次継続率"] },
          ]
        },
        "コンテンツ多様性": {
          metrics: [
            { behavior: "視聴ジャンル数", outcome: ["月次継続率", "全体7日継続率"] },
            { behavior: "視聴配信の言語種類数", outcome: ["月次継続率"] },
            { behavior: "視聴時間帯の分散度", outcome: ["時間帯毎の視聴率", "DAU/MAU比率",  "MAU", "DAU", "月次継続率"] },
            { behavior: "時間帯、曜日分散、Seasonality", outcome: ["時間帯/曜日毎の視聴率", "DAU/MAU比率",  "MAU", "DAU", "月次継続率"] },
          ]
        },
        "コミュニティ": {
          metrics: [
            { behavior: "所属するコミュニティの数", outcome: ["月次継続率", "全体7日継続率"] },
            { behavior: "参加ギャング数", outcome: ["月次継続率", "全体7日継続率"] },
            { behavior: "所属するコミュニティでの貢献度", outcome: ["エンゲージメントファネル", "月次継続率"] },
            { behavior: "配信後のライバー交流頻度", outcome: ["エンゲージメントファネル", "月次継続率"] },
          ]
        },
      }
    },
    "発見・マッチング": {
      color: "#FEF3C7",
      subcategories: {
        "新規発見": {
          metrics: [
            { behavior: "新規配信者の発見率(初見視聴率)", outcome: ["推しライバー発見率", "ライバーマッチング数"] },
            { behavior: "新規ライバー視聴数", outcome: ["推しライバー発見率", "ライバーマッチング数"] },
            { behavior: "好きなライバーを見つけるまでにかかった時間", outcome: ["推しライバー発見率", "ライバーマッチング数", "新規ユーザー7日継続率"] },
            { behavior: "レコメンドからの視聴率", outcome: ["推しライバー発見率", "ライバーマッチング数", "検索後視聴転換率"] },
          ]
        },
        "検索・導線": {
          metrics: [
            { behavior: "検索→視聴のコンバージョン率", outcome: ["検索後視聴転換率", "ライバーマッチング数"] },
            { behavior: "検索成功率", outcome: ["検索後視聴転換率", "推しライバー発見率"] },
            { behavior: "目的の配信到達率", outcome: ["検索後視聴転換率", "新規ユーザー初日視聴率"] },
            { behavior: "配信発見までのタップ数/画面遷移数", outcome: ["新規ユーザー初日視聴率", "検索後視聴転換率"] },
            { behavior: "ホーム画面からの直接視聴率", outcome: ["新規ユーザー初日視聴率", "DAU/MAU比率"] },
          ]
        },
        "初期体験": {
          metrics: [
            { behavior: "新規登録直後の配信視聴(X分)", outcome: ["新規ユーザー初日視聴率", "新規ユーザー7日継続率"] },
            { behavior: "起動→視聴開始までの時間", outcome: ["新規ユーザー初日視聴率", "新規ユーザー7日継続率"] },
            { behavior: "新規登録後D1-D7でのアクティブユーザー率", outcome: ["新規ユーザー7日継続率", "全体7日継続率"] },
          ]
        },
      }
    },
    "課金・収益": {
      color: "#FEE2E2",
      subcategories: {
        "ギフティング行動": {
          metrics: [
            { behavior: "ギフト送信単価", outcome: ["ARPPU", "消費者ARPPU"] },
            { behavior: "ギフト送信先の配信者数", outcome: ["課金率", "消費率"] },
            { behavior: "同じライバーへのギフティング頻度", outcome: ["継続ギフティング率・人数", "ARPPU"] },
            { behavior: "推しライバーへのギフティング集中度", outcome: ["継続ギフティング率", "ARPPU"] },
            { behavior: "上位ライバーへのギフティング偏り", outcome: ["消費率", "高課金転換ライバー指標"] },
          ]
        },
        "課金転換": {
          metrics: [
            { behavior: "CVR(リスナーからギフターになり、継続ギフターになる)", outcome: ["課金率", "継続ギフティング率・人数", "当月登録者課金転換率"] },
            { behavior: "初課金(Cash revenue観点)までにかかった時間", outcome: ["初回課金リードタイム", "当月登録者課金転換率", "新規ユーザー7日課金率"] },
            { behavior: "初ギフトまでの日数", outcome: ["当月登録者課金転換率", "新規ユーザー7日課金率", "初回課金リードタイム"] },
            { behavior: "ギフターランク上昇率", outcome: ["課金率", "継続ギフティング率", "Tier 1 & Tier 2 ユーザー数"] },
            { behavior: "リスナーの課金先の種類数", outcome: ["課金率", "消費率"] },
          ]
        },
        "継続課金": {
          metrics: [
            { behavior: "課金ユーザー率、継続課金率", outcome: ["課金率", "継続課金率", "継続IAP課金率", "継続VIP課金率"] },
            { behavior: "VIP課金率", outcome: ["継続VIP課金率・人数", "日次課金売上(VIP)", "月次課金売上(VIP)"] },
            { behavior: "アーミーサブスク登録率、継続率", outcome: ["継続アーミー課金率・人数", "消費率(アーミー含む)"] },
          ]
        },
        "高額課金": {
          metrics: [
            { behavior: "ダイヤモンド会員、高額課金Tier1, Tier2ユーザー数", outcome: ["Tier 1 & Tier 2 ユーザー数", "ダイヤモンド会員数"] },
            { behavior: "ダイヤモンド会員、高額課金Tier1, Tier2ユーザーの課金額", outcome: ["Tier 1 & Tier 2 ユーザー課金売上", "ダイヤモンド会員課金売上", "課金者ARPPU"] },
            { behavior: "ダイヤモンド会員、高額課金Tier1, Tier2ユーザーのコイン消費額", outcome: ["Tier 1 & Tier 2 ユーザーBC消費売上", "ダイヤモンド会員BC消費売上", "消費者ARPPU"] },
            { behavior: "ARPU(MTD Cash Revenue / Active User)", outcome: ["課金者ARPPU", "消費者ARPPU", "Tier 1 & Tier 2 ユーザーARPPU", "ダイヤモンド会員ARPPU", "課金率"] },
          ]
        },
        "消費効率": {
          metrics: [
            { behavior: "ギフト消費効率(一定期間での購入→使用率)", outcome: ["BC消費率", "リメインポイント消費平均期間", "一定数課金から消費までのスパンを指標化"] },
          ]
        },
      }
    },
    "ロイヤリティ": {
      color: "#E0E7FF",
      subcategories: {
        "推し関係": {
          metrics: [
            { behavior: "推しライバー維持率(長期応援継続)", outcome: ["月次継続率", "全体7日継続率", "既存ユーザー7日継続率"] },
            { behavior: "推し変更率(他ライバーへの移行)", outcome: ["月次継続率", "継続ギフティング率"] },
            { behavior: "お気に入り/フォロー中からの視聴率", outcome: ["DAU/MAU比率", "MAU", "DAU", "翌日継続率"] },
            { behavior: "配信スケジュールの確認頻度", outcome: ["DAU/MAU比率", "MAU", "DAU", "翌日継続率"] },
          ]
        },
        "アーカイブ": {
          metrics: [
            { behavior: "アーカイブの再視聴率", outcome: ["DAU/MAU比率", "MAU", "DAU", "ローリング30日視聴者数"] },
          ]
        },
        "マルチデバイス": {
          metrics: [
            { behavior: "複数デバイスからのアクセス有無(サブアカ)", outcome: ["DAU/MAU比率", "MAU", "DAU", "月次継続率"] },
          ]
        },
      }
    },
    "イベント・キャンペーン": {
      color: "#FED7AA",
      subcategories: {
        "参加行動": {
          metrics: [
            { behavior: "参加したイベント数", outcome: ["リスナーとしてのイベント参加あたりの平均収益(ARPU)", "イベント期間中のギフティング額"] },
            { behavior: "キャンペーン企画の種類数", outcome: ["キャンペーンROAS"] },
            { behavior: "イベント支援効率", outcome: ["BC消費率", "ギフト金額あたり順位上昇度"] },
          ]
        },
        "施策効率": {
          metrics: [
            { behavior: "キャンペーン費用あたりの新規課金率", outcome: ["キャンペーンROAS", "当月登録者課金転換率"] },
            { behavior: "施策の投資効率(キャンペーン費用あたりの新規課金・リテンション率)", outcome: ["キャンペーンROAS", "当月登録者課金転換率", "新規ユーザー7日継続率"] },
            { behavior: "CPR vs ROAS の乖離モニタリング", outcome: ["キャンペーンROAS", "流入経路別ROAS"] },
            { behavior: "ROAS(流入経路別の広告効率)", outcome: ["流入経路別ROAS", "キャンペーンROAS"] },
            { behavior: "流入経路別の継続率", outcome: ["全体7日継続率", "月次継続率", "既存ユーザー7日継続率"] },
          ]
        },
        "キャスティング(マーケティング)": {
          metrics: [
            { behavior: "キャスティング費用に対するROI", outcome: ["キャスティングROI", "キャスティング施策LTV", "高課金転換ライバー指標"] },
          ]
        },
      }
    },
    "シェア・バイラル": {
      color: "#FBCFE8",
      subcategories: {
        "拡散行動": {
          metrics: [
            { behavior: "シェアをしたライバーの数", outcome: ["カムバックユーザー数・率"] },
          ]
        },
      }
    },
    "その他・サポート": {
      color: "#F3F4F6",
      subcategories: {
        "問い合わせ": {
          metrics: [
            { behavior: "運営への問い合わせ数", outcome: ["対象ユーザーの継続率", "ポジティブなフィードバック率"] },
            { behavior: "高額課金ユーザーからの一定期間内のお問い合わせ数", outcome: ["対象ユーザーの継続率", "ポジティブなフィードバック率"] },
          ]
        },
      }
    },
  };

  useEffect(() => {
    createVisualization();
  }, [searchTerm, selectedCategory]);

  const createVisualization = () => {
    const width = 2000;
    const height = 1800;
    
    const nodes = new Map();
    const links = [];
    
    // データ構造からノードとリンクを生成
    Object.entries(kpiStructure).forEach(([category, categoryData]) => {
      Object.entries(categoryData.subcategories).forEach(([subcategory, subData]) => {
        subData.metrics.forEach(metric => {
          const behaviorId = metric.behavior;
          
          // 行動指標ノードを追加
          if (!nodes.has(behaviorId)) {
            nodes.set(behaviorId, {
              id: behaviorId,
              type: 'behavior',
              label: metric.behavior,
              category: category,
              subcategory: subcategory,
              color: categoryData.color
            });
          }
          
          // 成果指標ノードとリンクを追加
          metric.outcome.forEach(outcome => {
            const outcomeId = outcome;
            if (!nodes.has(outcomeId)) {
              nodes.set(outcomeId, {
                id: outcomeId,
                type: 'result',
                label: outcome,
                category: null,
                subcategory: null,
                color: '#ffffff'
              });
            }
            
            links.push({
              source: behaviorId,
              target: outcomeId,
              category: category
            });
          });
        });
      });
    });
    
    let filteredNodes = Array.from(nodes.values());
    let filteredLinks = links;
    
    // カテゴリフィルタ
    if (selectedCategory !== 'all') {
      filteredNodes = filteredNodes.filter(n => 
        n.category === selectedCategory || n.type === 'result'
      );
      const nodeIds = new Set(filteredNodes.map(n => n.id));
      filteredLinks = links.filter(l => 
        nodeIds.has(l.source) && nodeIds.has(l.target)
      );
    }
    
    // 検索フィルタ
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchedNodes = filteredNodes.filter(n => 
        n.label.toLowerCase().includes(term)
      );
      const nodeIds = new Set(matchedNodes.map(n => n.id));
      
      filteredLinks = filteredLinks.filter(l => 
        nodeIds.has(l.source) || nodeIds.has(l.target)
      );
      
      // リンクに関連するノードも含める
      const linkedNodeIds = new Set();
      filteredLinks.forEach(l => {
        linkedNodeIds.add(l.source);
        linkedNodeIds.add(l.target);
      });
      
      filteredNodes = filteredNodes.filter(n => linkedNodeIds.has(n.id));
    }
    
    // 既存のSVGをクリア
    d3.select(svgRef.current).selectAll('*').remove();
    
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);
    
    const g = svg.append('g');
    
    const zoom = d3.zoom()
      .scaleExtent([0.2, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    
    svg.call(zoom);
    svg.call(zoom.transform, d3.zoomIdentity.scale(0.45));
    
    // 力学シミュレーション
    const simulation = d3.forceSimulation(filteredNodes)
      .force('link', d3.forceLink(filteredLinks)
        .id(d => d.id)
        .distance(250))
      .force('charge', d3.forceManyBody().strength(-1200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(120))
      .force('x', d3.forceX(d => d.type === 'behavior' ? width * 0.3 : width * 0.7).strength(0.4))
      .force('y', d3.forceY(height / 2).strength(0.05));
    
    // マーカー
    svg.append('defs').selectAll('marker')
      .data(['arrow'])
      .enter().append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 30)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#999');
    
    // リンク
    const link = g.append('g')
      .selectAll('line')
      .data(filteredLinks)
      .enter().append('line')
      .attr('stroke', '#ccc')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1.5)
      .attr('marker-end', 'url(#arrow)');
    
    // ノード
    const node = g.append('g')
      .selectAll('g')
      .data(filteredNodes)
      .enter().append('g')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));
    
    node.append('circle')
      .attr('r', d => d.type === 'behavior' ? 14 : 11)
      .attr('fill', d => d.type === 'behavior' ? d.color : '#f87171')
      .attr('stroke', d => d.type === 'behavior' ? '#333' : '#fff')
      .attr('stroke-width', 2.5)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('r', d.type === 'behavior' ? 18 : 15)
          .attr('stroke-width', 4);
        setSelectedNode(d);
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .attr('r', d.type === 'behavior' ? 14 : 11)
          .attr('stroke-width', 2.5);
      });
    
    node.append('rect')
      .attr('x', 16)
      .attr('y', -11)
      .attr('width', d => d.label.length * 9.5 + 14)
      .attr('height', 24)
      .attr('fill', 'white')
      .attr('rx', 4)
      .attr('opacity', 0.95)
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', 1)
      .attr('pointer-events', 'none');
    
    node.append('text')
      .text(d => d.label)
      .attr('x', 20)
      .attr('y', 5)
      .attr('font-size', '13px')
      .attr('font-weight', '600')
      .attr('fill', '#1f2937')
      .attr('pointer-events', 'none');
    
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      
      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });
    
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  };

  const categories = Object.keys(kpiStructure);

  return (
    <div className="font-sans p-5 bg-gray-50 min-h-screen">
      <div className="mb-5 bg-white p-6 rounded-xl shadow-sm">
        <h1 className="m-0 mb-4 text-gray-900 text-3xl font-bold">
          KPI関係図 (ユーザー側): 階層構造による分類
        </h1>
        
        <div className="mb-5">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            カテゴリフィルタ
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-2.5 px-3.5 border border-gray-300 rounded-md text-sm bg-white cursor-pointer"
          >
            <option value="all">すべて表示</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            キーワード検索
          </label>
          <input
            type="text"
            placeholder="指標を検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2.5 px-3.5 border border-gray-300 rounded-md text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          {Object.entries(kpiStructure).map(([cat, data]) => (
            <div key={cat} className="flex items-center gap-1.5">
              <div 
                className="w-4 h-4 rounded-full border-2 border-gray-900"
                style={{ backgroundColor: data.color }}
              ></div>
              <span className="text-xs text-gray-600">{cat}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-red-400 rounded-full border-2 border-white"></div>
            <span className="text-xs text-gray-600">成果指標</span>
          </div>
        </div>

        {selectedNode && (
          <div 
            className="p-3.5 rounded-md border border-gray-200"
            style={{ 
              backgroundColor: selectedNode.type === 'behavior' ? selectedNode.color : '#fee2e2'
            }}
          >
            <div className="text-xs font-semibold text-gray-600 mb-1">
              {selectedNode.type === 'behavior' ? `${selectedNode.category} > ${selectedNode.subcategory}` : '成果指標'}
            </div>
            <div className="text-base font-bold text-gray-900">
              {selectedNode.label}
            </div>
          </div>
        )}

        <div className="mt-3.5 text-xs text-gray-600">
          💡 ノードをドラッグして配置調整 | マウスホイールでズーム | 背景ドラッグで移動
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default KPIRelationDiagram;