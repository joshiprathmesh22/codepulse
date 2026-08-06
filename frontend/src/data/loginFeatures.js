import GitHubIcon from "../components/icons/GitHubIcon";
import AnalyticsIcon from "../components/icons/AnalyticsIcon";
import TeamIcon from "../components/icons/TeamIcon";
import SecureIcon from "../components/icons/SecureIcon";

const loginFeatures = [

    {
        Icon: GitHubIcon,
        title: "GitHub Integration",
        desc: "Secure OAuth connection with real-time data synchronization.",
        color:"#4F7EFF",
        bg:"rgba(79,126,255,.12)"
    },

    {
        Icon: AnalyticsIcon,
        title:"Smart Analytics",
        desc:"Track commits, PRs and engineering metrics.",
        color:"#A78BFF",
        bg:"rgba(167,139,255,.12)"
    },

    {
        Icon: TeamIcon,
        title:"Team Insights",
        desc:"Understand team productivity and collaboration.",
        color:"#10D98D",
        bg:"rgba(16,217,141,.12)"
    },

    {
        Icon: SecureIcon,
        title:"Enterprise Security",
        desc:"JWT authentication with secure API access.",
        color:"#F5A623",
        bg:"rgba(245,166,35,.12)"
    }

];

export default loginFeatures;