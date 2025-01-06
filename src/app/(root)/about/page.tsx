import Nav from "~/components/nav";

export default function About() {
    return (
        <>
            <Nav />
            <div className="container">
                <div className="card">
                    <h1 className="title">MMXIV</h1>
                    <p className="section-content">A prediction game for 2025.</p>

                    <div className="section">
                        <h2 className="section-title">Game Stages</h2>
                        
                        <div className="section">
                            <h3 className="subtitle">Stage 0: Account creation</h3>
                            <p className="section-content">Sign up for an account, invite friends.</p>
                            <strong className="meta">Ends on January 20, 2025</strong>
                        </div>

                        <div className="section">
                            <h3 className="subtitle">Stage 1: Market submission</h3>
                            <p className="section-content">Submit markets and resolution criteria.</p>
                            <strong className="meta">Ends on January 22, 2025</strong>
                        </div>

                        <div className="section">
                            <h3 className="subtitle">Stage 2: Market voting</h3>
                            <p className="section-content">Upvote / Downvote on the markets you think are interesting, suggest changes to the resolution criteria.</p>
                            <strong className="meta">Ends on January 23, 2025</strong>
                        </div>

                        <div className="section">
                            <h3 className="subtitle">Stage 3: Money Lines</h3>
                            <p className="section-content">Make your best guess on the probability of each market outcome. Get points for getting close to the wisdom of the crowd.</p>
                            <strong className="meta">Ends on January 24, 2025</strong>
                        </div>

                        <div className="section">
                            <h3 className="subtitle">Stage 4: Prediction</h3>
                            <p className="section-content">Select YES/NO for each market you are interested in.</p>
                            <strong className="meta">Ends on January 25, 2025</strong>
                        </div>

                        <div className="section">
                            <h3 className="subtitle">Stage 5: Resolution</h3>
                            <p className="section-content">The markets are resolved and the results are announced.</p>
                            <strong className="meta">Ends on December 31, 2025</strong>
                        </div>
                    </div>

                    <div className="section">
                        <h2 className="section-title">Points System</h2>
                        
                        <div className="section">
                            <h3 className="subtitle">Money line points</h3>
                            <p className="section-content">Points are deducted for being too far from the average prediction. Everyone starts with 100 * number of markets.</p>
                            <p className="section-content">Example: You think the market "Aliens make contact" has a 10% chance of happening. The average prediction is 8%. You lose 2 points and get 98 points.</p>
                        </div>

                        <div className="section">
                            <h3 className="subtitle">Market points</h3>
                            <p className="section-content">Points are awarded based on how well you do in the markets you selected, and how surprising the outcome is.</p>
                            <p className="section-content">Example: The market "Aliens make contact" has a 10% chance of happening. You vote YES. It happens. you get 100 points * 100/10 = 1000 points.</p>
                            <p className="section-content">Example: The market "Aliens make contact" has a 10% chance of happening. You vote YES. It doesn't happen. You get 0 points.</p>
                        </div>
                    </div>

                    <div className="section">
                        <h2 className="section-title">Winning</h2>
                        <p className="section-content">The player with the most points at the end of the game wins all the marbles.</p>
                    </div>

                    <div className="section">
                        <h2 className="section-title">Conflict Resolution</h2>
                        <p className="section-content">Markets should have good resolution criteria, and everyone should be able to agree on the outcome.</p>
                        <p className="section-content">If there is a dispute, we will do a vote at the end of the game.</p>
                        <p className="section-content">Since this is the first year we are doing this, and may have some issues, we will do a vote at the end of the game as to whether the game was successful. If majority say yes, we will issue the prize money to the winner. If majority say no, we will refund everyone.</p>
                        <p className="section-content">Players are STRONGLY encouraged to resolve disputes in good faith, but no one will be banned and admins will not do anything other than dev stuff.</p>
                    </div>
                </div>
            </div>
        </>
    );
}