// Pre-written answer scripts for each persona × question combination

export interface Question {
    id: string;
    text: string;
}

export interface PersonaScript {
    personaId: string;
    answers: Record<string, string>; // questionId -> answer
}

export const QUESTIONS: Question[] = [
    { id: 'q1', text: 'What makes you pick up your phone to look for a new pair?' },
    { id: 'q2', text: 'Describe the last time you got excited about a Nike release.' },
    { id: 'q3', text: 'How do you feel about the SNKRS drop system?' },
    { id: 'q4', text: 'What would make you more confident pulling the trigger on a purchase?' },
    { id: 'q5', text: 'What\'s your relationship with the resale market?' },
    { id: 'q6', text: 'What does Nike get wrong about people like you?' },
];

export const SCRIPTS: PersonaScript[] = [
    {
        personaId: 'sarah',
        answers: {
            q1: "Honestly? My old running shoes start feeling beat up and I need a replacement. I'm not browsing for fun — I'm solving a problem. I'll compare three or four options, read the reviews, check the return policy, and make a decision in about forty minutes. I don't really chase trends.",
            q2: "I'm not sure 'excited' is the right word for me. I found a pair of Pegasus 41s on sale during the summer. They were exactly what I needed, the price was right, and they shipped in two days. That was a good experience. A good shoe that showed up when it was supposed to.",
            q3: "It's kind of alienating? Artificially limiting supply so people fight over shoes feels like a gimmick. I understand hype mechanics in theory but it makes no sense to me as a consumer. If I want something, I want to be able to buy it. I don't want to 'win' it.",
            q4: "Better fit data. Tell me my last three pairs ran a half size small and this one should be true to size. Show me how the heel drop compares to what I'm wearing now. Give me a comparison against my workout data if you have it. Stop talking about the 'story' and tell me what the shoe can do.",
            q5: "I don't really participate. I've seen pairs go for triple MSRP and I just can't justify that. If something sells out and I missed it, I move on. There are always other options. The resale market feels like a tax on not having a faster Wi-Fi connection.",
            q6: "They think I want to feel like an athlete. I just want shoes that don't hurt my feet by mile seven and don't fall apart in eight months. I don't need a cinematic ad. I need a table that tells me the stack height and weight versus last year's model.",
        }
    },
    {
        personaId: 'david',
        answers: {
            q1: "I get a push notification from the SNKRS app or I see someone post a resale listing that's going up — that's the signal that something I might want is going to move. Then I start doing my homework. Pull up the original drop price, check StockX, see where the trajectory is heading. It's more like monitoring a portfolio than shopping.",
            q2: "The Travis Scott Olive 1 restock. I'd been watching it for two years. Got the notification, froze up for about three seconds deciding if I should go for it, and missed the window by maybe thirty seconds. I've thought about that thirty seconds a lot. I did eventually get a pair on the secondary market but it cost me an extra four hundred dollars. That's on me.",
            q3: "It's broken but I understand why it exists. The scarcity is the product. Without the 'L', the 'W' wouldn't mean anything. What kills me is the bots. It's no longer about who wants it most — it's about who has the best automation. That's not a skills game anymore. That's a pay-to-win system.",
            q4: "Honestly? Authorization. If my profile had a history — what I've bought, what I've kept, my wear patterns — and Nike could use that to prioritize my access to a drop, I'd be a completely different consumer. I'd probably stop buying multiples 'just in case.' I'd buy to wear instead of to preserve.",
            q5: "The resale market is my insurance policy. I know the pairs I buy will hold or appreciate if I take care of them. But the maintenance anxiety is real. I have stuff in rotating storage with silica gel packets. My girlfriend thinks it's insane. She might not be wrong.",
            q6: "They treat loyalty as transactional. There's no memory. Every drop, I'm just another anonymous user against two million other anonymous users and a bot farm. I've spent over six thousand dollars on Nike products in the last three years. That should mean something. It doesn't.",
        }
    },
    {
        personaId: 'chloe',
        answers: {
            q1: "TikTok, almost always. Someone posts an outfit I love, I screenshot it, run it through a visual search, and within ten minutes I've usually found the exact look or something close — often for a fraction of the price. When I see Nike's styling on someone's feed, I want the aesthetic, not necessarily the label.",
            q2: "It's not about Nike releases for me. It's about the visual moment. I got really into the Panda Dunk look but I wasn't going to pay the resale price. I found a pair at a third-party brand that hit essentially the same energy. I built an entire fit around them. Got like forty thousand views. The algorithm doesn't care who made the shoes.",
            q3: "I think it's a really effective marketing strategy that's gotten a little too complicated for casual buyers. The scarcity creates content, which creates demand, which justifies the scarcity. I respect the mechanics. I just opt out of them because there are better paths to the same destination.",
            q4: "Honestly? If the styling was better integrated. Nike is great at shoes but their in-app styling suggestions are generic. Show me what's trending in my city, show me how the shoe sits in a real outfit — not a studio shot. Let me see it on people who look like me. That's what would move me.",
            q5: "I've sold twice. Both times I bought something thinking I'd wear it and then it just didn't fit my wardrobe the way I imagined. Got back most of what I paid. The resale market is fine, it's just not my main channel. I tend to find better value elsewhere.",
            q6: "They assume that everyone who follows sneaker culture wants to participate in sneaker culture the same way. Some of us are here for the aesthetic signal, not the status game. I'll buy Nike when the design is genuinely different. I won't queue for anything."
        }
    },
    {
        personaId: 'maya',
        answers: {
            q1: "Usually it starts offline — I'll see something on someone at a market or a show and I want to know the story behind it. Then I go dig. I'm mostly on Depop and Grailed for Nike. I want the Archive Nineties stuff or weird regional releases. I want things that have already lived a life.",
            q2: "I found a pair of 2001 Air Max 95s in an estate sale box, deadstock, my size. I nearly cried. That's not a Nike release experience — that's a finding experience. The brand was incidental. The object was extraordinary. That's the version of Nike I love. The one that didn't know it was going to become a cultural artifact.",
            q3: "It creates a kind of anxiety I find really unappealing. The whole infrastructure around drops — the notifications, the countdowns, the W and L language — it gamifies consumption in a way that I think is kind of corrosive. It turns buying shoes into a personality. I'd rather my personality be about what I do in the shoes.",
            q4: "A genuine provenance story. Tell me who designed this, what was happening in culture when they made it, what problem they were solving. Not a brand video — actual information. And if it's a 'retro,' be honest about what you changed and why. Don't just sell me nostalgia you manufactured last Tuesday.",
            q5: "I participate in it on the buying side, mostly for vintage and older retroing. I don't flip. It feels extractive to me. But I also recognize I'm not totally consistent — I've paid fair market for things I couldn't find otherwise. The circular economy isn't perfect but it's better than buying new synthetic product every season.",
            q6: "They don't actually know their own archive. They'll pull a shoe from 1994 and the marketing team will tell you it was inspired by 'bold culture' and 'vibrant self-expression.' Talk to the actual designer. Show me the original sketch. Nike has some of the most interesting design history in consumer products and they use it like wallpaper.",
        }
    },
    {
        personaId: 'alex',
        answers: {
            q1: "A cook group alert or a leak on Twitter. I'm not browsing, I'm monitoring. I have five different notification setups across SNKRS, CONFIRMED, Foot Locker. The second I see a confirmed SKU and a release date, I'm doing the math — projected resale, bot cost, time investment. If the numbers look right I'm in. If they don't, I pass.",
            q2: "Cooked on the 4s Bred last November. Had three tasks running, manual backup, hit the W on one of them. Flipped within forty-eight hours for two-eighty over retail. That's it. That's the feeling. Not the shoe — the W. I've had pairs I cooked on that I still haven't opened because opening them would convert an asset into a depreciating object.",
            q3: "It's a tax collection machine at this point. Nike collects the brand equity, the resellers collect the arbitrage, consumers who actually want to wear the shoes pay the premium. I'm on the collection side for now. But if Nike ever figured out how to cut out the resale market they could capture all of that margin themselves. They don't because secondary market hype drives primary demand.",
            q4: "A transparent market value indicator in the app. Tell me what the pair I'm looking at is currently trading for on secondary. That would tell me instantly if it's worth the risk. Right now I have to have four apps open to build that picture manually. If Nike built it in, I'd trust the platform more. They won't, but that's what I'd want.",
            q5: "It's most of my income right now. I net about four thousand a month on good months, less on bad months. The cook group membership covers itself in one good flip. It's not a sustainable long-term play — market is getting crowded, brand is pulling back on collabs — but right now it's real money. I treat it like a job because it is one.",
            q6: "They think we're the villains. They built a system on scarcity and then act offended when people figure out how to monetize that scarcity. The bot problem is their problem, not mine. They have KYC tools, they have purchase history data, they have hardware fingerprinting capability. They choose not to deploy it fully because hype is worth more to them than fair access. Don't lecture me about community when the whole system is designed to manufacture exclusion.",
        }
    }
];

export const FOCUS_GROUP_SCRIPTS: Record<string, Record<string, string>> = {
    // questionId -> personaId -> answer (for focus group mode)
};
