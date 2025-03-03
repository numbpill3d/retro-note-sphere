
import React, { useEffect, useRef } from 'react';
import { useNotes, NoteType } from '../context/NoteContext';
import * as d3 from 'd3';

const GraphView: React.FC = () => {
  const { notes, currentNote, setCurrentNote } = useNotes();
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || notes.length === 0) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Create node data
    const nodes = notes.map(note => ({
      id: note.id,
      title: note.title || 'Untitled',
      r: currentNote?.id === note.id ? 10 : 6, // Larger radius for current note
    }));

    // Create links between parent and children
    const links = notes
      .filter(note => note.parentId !== null)
      .map(note => ({
        source: note.parentId as string,
        target: note.id,
      }));

    // Create simulation
    const simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force('charge', d3.forceManyBody().strength(-150))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(60))
      .force('collision', d3.forceCollide().radius(20));

    // Create SVG elements
    const svg = d3.select(svgRef.current);

    // Create links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', '#808080')
      .attr('stroke-width', 1);

    // Create nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', (d: any) => d.r)
      .attr('fill', (d: any) => d.id === currentNote?.id ? '#000080' : '#c0c0c8')
      .attr('stroke', '#000000')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .on('click', (event, d: any) => {
        const note = notes.find(n => n.id === d.id);
        if (note) {
          setCurrentNote(note);
        }
      })
      .call(d3.drag<SVGCircleElement, any>()
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

    // Add titles
    node.append('title')
      .text((d: any) => d.title);
    
    // Add labels
    const label = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .enter().append('text')
      .text((d: any) => d.title)
      .attr('font-size', '8px')
      .attr('dx', 12)
      .attr('dy', 4)
      .style('pointer-events', 'none');

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
    };
  }, [notes, currentNote, setCurrentNote]);

  return (
    <div className="h-full win98-inset overflow-hidden">
      <svg ref={svgRef} width="100%" height="100%"></svg>
    </div>
  );
};

export default GraphView;
