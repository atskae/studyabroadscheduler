import React from 'react';
import { Grid, Button, Table } from 'semantic-ui-react';

const scholarships = [
	{
		name: "Benjamin A. Gilman Scholarship",
		description: "For majors underrepresented overseas (this includes CS!)",
		deadline: ""
	},
	{
		name: "Women Techmakers Scholarship",
		description: "For women undergraduates.",
		deadline: ""
	},
];

class PlannerSheet extends React.Component {
	
	render() {

		const scholarshipRows = scholarships.map((s) => {
			return(
				<Table.Row>
					<Table.Cell>
						{s.name}
					</Table.Cell>
					<Table.Cell>
						{s.description}
					</Table.Cell>
					<Table.Cell>
						{s.deadline}
					</Table.Cell>
				</Table.Row>
			);	
		});

		const steps = [
			{
				step: `Find a study abroad program for ${this.props.selectedSemester} ${this.props.selectedYear}`,
				content:(
						<div>
							<a href='https://abroad.binghamton.edu/index.cfm?FuseAction=Programs.ListAll' target="_blank" rel="noopener noreferrer">
								<Button>
									Find a Binghamton Program
								</Button>
							</a>

							<a href='https://www.suny.edu/studyabroad/' target="_blank" rel="noopener noreferrer">
								<Button>
									Find a SUNY Program
								</Button>
							</a>
						</div>
				),
			},
			{
				step: 	"Of the study abroad programs found, select the programs that offer the courses below. " + 
						"Save the course descriptions provided by the study abroad school and obtain approval of " +
						"these courses from the Computer Science Department.",
				content: (
						<div>
							<p>Contact the Undergraduate Program Director for Computer Science and Watson Advising for course approval.</p>		
							<p>Does the school not offer these courses? Select a different schedule or select a different semester.</p>
						</div>
				),
			},
			{
				step: "Review your study abroad program thoroughly.",
				content: (
						<div>
							<p>Once you found a program that meets the course requirements, you should also note the following:</p>		
							<ul>
								<li>Academic deadline</li>
								<li>Academic requirements (GPA, year, etc.)</li>
							</ul>
						</div>
				),
			},
			{
				step: "Start your study abroad application.",
				content: (
						<div>
							<p>
								For Binghamton programs, you can log into the study abroad programs website.
								For other SUNY programs, you must create an account for the SUNY school. In addition, 
								you must complete an application on the Binghamton study abroad programs website titled 
								“Study Abroad - Other SUNY Program”.
							</p>
							<p>Minimally, study abroad programs require the following:</p>	
							<ul>
								<li>2 academic reccomendations</li>
								<li>Statement of purpose</li>
							</ul>
						</div>
				),
			},
			{
				step: "Apply to scholarships!",
				content: (
						<div>
							<p>
								There are many funding opportunities available for study abroad. 
								Check the official scholarship website for deadlines. Apply early!	
							</p>
							<Table basic='very' celled collapsing>
								<Table.Header>
									<Table.Row>
										<Table.HeaderCell> Scholarship </Table.HeaderCell>
										<Table.HeaderCell> Description </Table.HeaderCell>
										<Table.HeaderCell> Estimated Deadline </Table.HeaderCell>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{scholarshipRows}
								</Table.Body>
							</Table>
						</div>
				),
			},

		];

		const content = steps.map( (step, index) => {
			return(
				<Grid>
					<Grid.Column>
						<h3>{index+1}) {step.step}</h3>
						{step.content}
					</Grid.Column>
				</Grid>		
			);
		});

		return(
			<div>
				<h1>Study Abroad Planner for {this.props.selectedSemester} {this.props.selectedYear}</h1>
				{content}
			</div>
		);
	}
}

export default PlannerSheet;
