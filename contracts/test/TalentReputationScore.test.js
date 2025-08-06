const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TalentReputationScore", function () {
    let TalentReputationScore;
    let reputationScore;
    let owner;
    let candidate1;
    let candidate2;

    beforeEach(async function () {
        [owner, candidate1, candidate2] = await ethers.getSigners();

        TalentReputationScore = await ethers.getContractFactory("TalentReputationScore");
        reputationScore = await TalentReputationScore.deploy();
        await reputationScore.deployed();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await reputationScore.owner()).to.equal(owner.address);
        });
    });

    describe("Score Creation", function () {
        it("Should create a reputation score", async function () {
            await reputationScore.createReputationScore(
                candidate1.address,
                85, // githubScore
                90, // slaCompliance
                88, // professionalismScore
                92, // technicalScore
                87  // communicationScore
            );

            const userScore = await reputationScore.getUserReputationScore(candidate1.address);
            expect(userScore.userAddress).to.equal(candidate1.address);
            expect(userScore.totalScore).to.equal(88); // Average of scores
        });

        it("Should reject scores over 100", async function () {
            await expect(
                reputationScore.createReputationScore(
                    candidate1.address,
                    101, // Invalid score
                    90, 88, 92, 87
                )
            ).to.be.revertedWith("Score must be between 0 and 100");
        });

        it("Should only allow owner to create scores", async function () {
            await expect(
                reputationScore.connect(candidate1).createReputationScore(
                    candidate2.address,
                    85, 90, 88, 92, 87
                )
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });

    describe("Score Updates", function () {
        beforeEach(async function () {
            await reputationScore.createReputationScore(
                candidate1.address,
                85, 90, 88, 92, 87
            );
        });

        it("Should update reputation score", async function () {
            const scoreId = await reputationScore.userToLatestScore(candidate1.address);

            await reputationScore.updateReputationScore(
                scoreId,
                90, 95, 92, 94, 89,
                "Improved performance"
            );

            const updatedScore = await reputationScore.getUserReputationScore(candidate1.address);
            expect(updatedScore.totalScore).to.equal(92); // New average
        });

        it("Should track score update history", async function () {
            const scoreId = await reputationScore.userToLatestScore(candidate1.address);

            await reputationScore.updateReputationScore(
                scoreId,
                90, 95, 92, 94, 89,
                "Performance improvement"
            );

            const updates = await reputationScore.getScoreUpdates(scoreId);
            expect(updates.length).to.equal(1);
            expect(updates[0].reason).to.equal("Performance improvement");
        });
    });
});
