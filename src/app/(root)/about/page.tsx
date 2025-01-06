import Nav from "~/components/nav";

export default function About() {
    return <div>
        <Nav />
        <h1>MMXIV is a prediction game for 2025.</h1>
        <h2>Stage 0: Account creation</h2>
        <p>Sign up for an account, invite friends.</p>
        <strong>Ends on January 20, 2025.</strong>
        <h2>Stage 1: Market submission deadline</h2>
        <p>Submit markets and resolution criteria.</p>
        <strong>Ends on January 22, 2025.</strong>
        <h2>Stage 2: Market voting</h2>
        <p>Upvote / Downvote on the markets you think are interesting, suggest changes to the resolution criteria.</p>
        <strong>Ends on January 23, 2025.</strong>
        <h2>Stage 3: Money Lines</h2>
        <p>Make your best guess on the probability of each market outcome. Get points for getting close to the wisdom of the crowd.</p>
        <strong>Ends on January 24, 2025.</strong>
        <h2>Stage 4: Prediction</h2>
        <p>Select YES/NO for each market you are interested in.</p>
        <strong>Ends on January 25, 2025.</strong>
        <h2>Stage 5: Resolution</h2>
        <p>The markets are resolved and the results are announced.</p>
        <strong>Ends on December 31, 2025.</strong>
        <h1>Points</h1>
        <h2>Money line points</h2>
        <p>Points are deducted for being too far from the average prediction.</p>
        <p>Everyone starts with 100 * number of markets.</p>
        <p>Example. You think the market "Aliens make contact" has a 10% chance of happening. The average prediction is 8%. You lose 2 points and get 98 points.</p>
        <h2>Market points</h2>
        <p>Points are awarded based on how well you do in the markets you selected, and how surprising the outcome is.</p>
        <p>Example. The market "Aliens make contact" has a 10% chance of happening. You vote YES. It happens. you get 100 points * 100/10 = 1000 points.</p>
        <p>Example. The market "Aliens make contact" has a 10% chance of happening. You vote YES. It doesn't happen. You get 0 points.</p>
        <h1>Winning</h1>
        <p>The player with the most points at the end of the game wins all the marbles.</p>
        <h1>Conflict Resolution</h1>
        <p>Markets should have good resolution criteria, and everyone should be able to agree on the outcome.</p>
        <p>If there is a dispute, we will do a vote at the end of the game.</p>
        <p>Since this is the first year we are doing this, and may have some issues, we will do a vote at the end of the game as to whether the game was successful. If majority say yes, we will issue the prize money to the winner. If majority say no, we will refund everyone.</p>
        <p>Players are STRONGLY encouraged to resolve disputes in good faith, but no one will be banned and admins will not do anything other than dev stuff.</p>
    </div>
}