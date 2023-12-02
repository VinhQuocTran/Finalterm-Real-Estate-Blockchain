'use strict';

const { Contract } = require('fabric-contract-api');

class VotingTransfer extends Contract {

    async init(ctx) {
        // Initialize any necessary state, e.g., set up the number of voters, candidates, etc.
    
        // Set up candidates
        await this.addCandidate(ctx, 1, "John Doe", "Independent");
        await this.addCandidate(ctx, 2, "Jane Smith", "Green Party");
        await this.addCandidate(ctx, 3, "Bob Johnson", "Democratic Party");
    
        // Set up voters
        await ctx.stub.putState('voter_Alice', Buffer.from('not voted'));
        await ctx.stub.putState('voter_Bob', Buffer.from('not voted'));
    
        // Set up voting dates
        const startDate = Math.floor(Date.now() / 1000); // current timestamp in seconds
        const endDate = startDate + 604800; // 1 week later
    
        await this.setDates(ctx, startDate, endDate);
    
        return 'Initialization successful';
    }
    

    async addCandidate(ctx, candidateID, name, party) {
        // Add a candidate to the state
        const candidate = {
            id: candidateID,
            name: name,
            party: party,
            voteCount: 0
        };

        await ctx.stub.putState(`candidate_${candidateID}`, Buffer.from(JSON.stringify(candidate)));
        return 'Candidate added successfully';
    }

    async vote(ctx, voterID, candidateID) {
        // Vote for a candidate
        const voterKey = `voter_${voterID}`;
        const candidateKey = `candidate_${candidateID}`;

        // Check if the voter has voted before
        const existingVoter = await ctx.stub.getState(voterKey);
        if (existingVoter && existingVoter.length > 0) {
            throw new Error('Voter has already voted.');
        }

        // Get the candidate from the state
        const candidateBytes = await ctx.stub.getState(candidateKey);
        if (!candidateBytes || candidateBytes.length === 0) {
            throw new Error('Candidate not found.');
        }

        const candidate = JSON.parse(candidateBytes.toString());

        // Update the candidate's vote count
        candidate.voteCount++;
        await ctx.stub.putState(candidateKey, Buffer.from(JSON.stringify(candidate)));

        // Mark the voter as having voted
        await ctx.stub.putState(voterKey, Buffer.from('voted'));

        return 'Vote cast successfully';
    }

    async getCandidate(ctx, candidateID) {
        // Get candidate details
        const candidateKey = `candidate_${candidateID}`;
        const candidateBytes = await ctx.stub.getState(candidateKey);

        if (!candidateBytes || candidateBytes.length === 0) {
            throw new Error('Candidate not found.');
        }

        return candidateBytes.toString('utf8');
    }

    async getResult(ctx, candidateID) {
        // Get the vote count for a candidate
        const candidateKey = `candidate_${candidateID}`;
        const candidateBytes = await ctx.stub.getState(candidateKey);

        if (!candidateBytes || candidateBytes.length === 0) {
            throw new Error('Candidate not found.');
        }

        const candidate = JSON.parse(candidateBytes.toString());
        return candidate.voteCount;
    }
}

module.exports = VotingContract;
