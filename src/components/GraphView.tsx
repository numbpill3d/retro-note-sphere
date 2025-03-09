
import React, { useEffect, useRef, useState } from 'react';
import { useNotes, NoteType } from '../context/NoteContext';
import * as d3 from 'd3';
import Win98Button from './Win98Button';
import { ZoomIn, ZoomOut, MousePointer, Move, Maximize2, X, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const GraphView: React.FC = () => {
  const { notes, currentNote, setCurrentNote } = useNotes();
  const svgRef = useRef<SVGSVGElement>(null);
  const { theme } = useTheme();
  const [zoom, setZoom] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const [highlightActive, setHighlightActive] = useState(false);
  const [dragMode, setDragMode] = useState<'select' | 'pan'>('select');

  // Get theme-specific colors
  const getThemeColors = () => {
    const defaultColors = {
      node: '#c0c0c8',
      highlight: '#000080',
      edge: '#808080',
      text: '#000000',
      background: '#f5f5f5',
    };

    switch(theme) {
      case 'cyber':
        return {
          node: '#1a1a40',
          highlight: '#00ffaa',
          edge: '#00ffaa',
          text: '#00ffaa',
          background: '#0B0B2B',
        };
      case 'terminal':
        return {
          node: '#000000',
          highlight: '#33ff00',
          edge: '#33ff00',
          text: '#33ff00',
          background: '#000000',
        };
      case 'y2k':
        return {
          node: '#ffcccc',
          highlight: '#ff6699',
          edge: '#cc66ff',
          text: '#8A8A8A',
          background: '#fff9f9',
        };
      case 'hacker':
        return {
          node: '#000000',
          highlight: '#00ff00',
          edge: '#00ff00',
          text: '#00ff00',
          background: '#000000',
        };
      default:
        return defaultColors;
    }
  };

  useEffect(() => {
    if (!svgRef.current || notes.length === 0) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const colors = getThemeColors();

    // Build graph data structure
    const buildGraphData = () => {
      // Create node-to-index mapping for quick lookup
      const nodeMap = new Map<string, number>();
      notes.forEach((note, index) => {
        nodeMap.set(note.id, index);
      });

      // Create nodes data
      const nodes = notes.map(note => ({
        id: note.id,
        title: note.title || 'Untitled',
        r: currentNote?.id === note.id ? 10 : 6, // Larger radius for current note
        tags: note.tags || [],
        parent: note.parentId,
      }));

      // Create links between parents and children
      const parentChildLinks = notes
        .filter(note => note.parentId !== null)
        .map(note => ({
          source: note.parentId as string,
          target: note.id,
          type: 'parent-child'
        }));

      // Create links for referenced notes (parsing markdown links)
      const contentLinks: { source: string; target: string; type: string }[] = [];
      notes.forEach(note => {
        const linkRegex = /\[.*?\]\(#(.*?)\)/g;
        let match;
        const content = note.content || '';
        
        while ((match = linkRegex.exec(content)) !== null) {
          const targetId = match[1];
          if (nodeMap.has(targetId)) {
            contentLinks.push({
              source: note.id,
              target: targetId,
              type: 'reference'
            });
          }
        }
      });

      // Combine all links
      const links = [...parentChildLinks, ...contentLinks];

      return { nodes, links };
    };

    const { nodes, links } = buildGraphData();

    // Create SVG and simulation
    const svg = d3.select(svgRef.current);
    
    // Create zoom behavior
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
        setZoom(event.transform.k);
      });

    // Apply zoom behavior
    if (dragMode === 'pan') {
      svg.call(zoomBehavior);
    } else {
      svg.on('.zoom', null);
    }

    // Create container for zoomable content
    const container = svg.append('g');

    // Create simulation
    const simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force('charge', d3.forceManyBody().strength(-150))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(60))
      .force('collision', d3.forceCollide().radius(20));

    // Create links
    const link = container.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', (d: any) => d.type === 'reference' ? colors.highlight : colors.edge)
      .attr('stroke-width', (d: any) => d.type === 'reference' ? 2 : 1)
      .attr('stroke-dasharray', (d: any) => d.type === 'reference' ? '5,5' : null);

    // Create nodes
    const node = container.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', (d: any) => d.r)
      .attr('fill', (d: any) => d.id === currentNote?.id ? colors.highlight : colors.node)
      .attr('stroke', '#000000')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .on('click', (event, d: any) => {
        if (dragMode === 'select') {
          const note = notes.find(n => n.id === d.id);
          if (note) {
            setCurrentNote(note);
          }
        }
      })
      .on('mouseover', function(event, d: any) {
        if (highlightActive) {
          // Highlight connected nodes
          const connectedLinks = links.filter((l: any) => 
            l.source.id === d.id || l.target.id === d.id
          );
          
          const connectedNodeIds = new Set<string>();
          connectedLinks.forEach((l: any) => {
            if (typeof l.source === 'object') {
              connectedNodeIds.add(l.source.id);
              connectedNodeIds.add(l.target.id);
            } else {
              connectedNodeIds.add(l.source);
              connectedNodeIds.add(l.target);
            }
          });
          
          node.attr('opacity', (n: any) => 
            n.id === d.id || connectedNodeIds.has(n.id) ? 1 : 0.3
          );
          
          link.attr('opacity', (l: any) => 
            l.source.id === d.id || l.target.id === d.id ? 1 : 0.3
          );
          
          label.attr('opacity', (n: any) => 
            n.id === d.id || connectedNodeIds.has(n.id) ? 1 : 0.3
          );
        }
        
        // Show tooltip
        tooltip
          .style('display', 'block')
          .html(`
            <div>${d.title}</div>
            ${d.tags.length > 0 ? `<div class="text-xs mt-1">Tags: ${d.tags.join(', ')}</div>` : ''}
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        if (highlightActive) {
          node.attr('opacity', 1);
          link.attr('opacity', 1);
          label.attr('opacity', (d: any) => showLabels ? 1 : 0);
        }
        tooltip.style('display', 'none');
      });

    // Add drag behavior to nodes
    node.call(d3.drag<SVGCircleElement, any>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }));

    // Add labels
    const label = container.append('g')
      .selectAll('text')
      .data(nodes)
      .enter().append('text')
      .text((d: any) => d.title)
      .attr('font-size', '8px')
      .attr('dx', 12)
      .attr('dy', 4)
      .attr('fill', colors.text)
      .style('pointer-events', 'none')
      .style('display', showLabels ? 'block' : 'none');

    // Add tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'win98-window absolute p-1 text-xs')
      .style('display', 'none')
      .style('position', 'absolute')
      .style('z-index', '10');

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      label
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);
    });

    return () => {
      simulation.stop();
      tooltip.remove();
    };
  }, [notes, currentNote, setCurrentNote, theme, showLabels, highlightActive, dragMode]);

  const handleZoomIn = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      const currentZoom = d3.zoomTransform(svg.node() as Element);
      const newZoom = currentZoom.scale(currentZoom.k * 1.2);
      svg.transition().duration(300).call(d3.zoom<SVGSVGElement, unknown>().transform, newZoom);
      setZoom(newZoom.k);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      const currentZoom = d3.zoomTransform(svg.node() as Element);
      const newZoom = currentZoom.scale(currentZoom.k / 1.2);
      svg.transition().duration(300).call(d3.zoom<SVGSVGElement, unknown>().transform, newZoom);
      setZoom(newZoom.k);
    }
  };

  const handleResetZoom = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(300).call(d3.zoom<SVGSVGElement, unknown>().transform, d3.zoomIdentity);
      setZoom(1);
    }
  };

  return (
    <div className="h-full flex flex-col win98-inset overflow-hidden">
      <div className="p-1 border-b border-win98-gray flex justify-between items-center">
        <div className="flex space-x-1">
          <Win98Button 
            variant="icon" 
            size="icon"
            icon={<MousePointer size={14} />} 
            active={dragMode === 'select'}
            title="Select mode"
            onClick={() => setDragMode('select')}
          />
          <Win98Button 
            variant="icon"
            size="icon" 
            icon={<Move size={14} />}
            active={dragMode === 'pan'} 
            title="Pan mode"
            onClick={() => setDragMode('pan')}
          />
        </div>
        
        <div className="flex space-x-1">
          <Win98Button 
            variant="icon"
            size="icon" 
            icon={<ZoomIn size={14} />} 
            title="Zoom in"
            onClick={handleZoomIn}
          />
          <Win98Button 
            variant="icon"
            size="icon" 
            icon={<ZoomOut size={14} />} 
            title="Zoom out"
            onClick={handleZoomOut}
          />
          <Win98Button 
            variant="icon"
            size="icon" 
            icon={<Maximize2 size={14} />} 
            title="Reset zoom"
            onClick={handleResetZoom}
          />
        </div>
        
        <div className="flex space-x-1">
          <Win98Button 
            size="xs" 
            onClick={() => setShowLabels(!showLabels)}
            active={showLabels}
          >
            Labels
          </Win98Button>
          <Win98Button 
            size="xs" 
            onClick={() => setHighlightActive(!highlightActive)}
            active={highlightActive}
          >
            Highlight
          </Win98Button>
          <Win98Button 
            variant="icon"
            size="icon"
            icon={<RefreshCw size={14} />} 
            title="Refresh graph"
            onClick={() => {
              // Force redraw by triggering a state change
              setShowLabels(!showLabels);
              setShowLabels(!showLabels);
            }}
          />
        </div>
      </div>
      
      <div className="flex-1 relative">
        <svg ref={svgRef} width="100%" height="100%" className="overflow-visible"></svg>
      </div>
    </div>
  );
};

export default GraphView;
