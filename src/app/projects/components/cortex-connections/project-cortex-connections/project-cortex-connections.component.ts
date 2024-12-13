import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { CortexConnectionsFindingsComponent } from '../cortex-connections-findings/cortex-connections-findings.component';
import { CortexConnectionsOverviewComponent } from '../cortex-connections-overview/cortex-connections-overview.component';
import { CortexConnectionsVisualsComponent } from '../cortex-connections-visuals/cortex-connections-visuals.component';

@Component({
  selector: 'project-cortex-connections',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    CortexConnectionsOverviewComponent,
    CortexConnectionsVisualsComponent,
    CortexConnectionsFindingsComponent,
  ],
  templateUrl: './project-cortex-connections.component.html',
  styleUrl: './project-cortex-connections.component.scss'
})
export class ProjectCortexConnectionsComponent {

}
