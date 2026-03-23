import Header from "./components/Header";

function LandingLayout ({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="min-h-screen bg-white">
            <Header />
            {/* pt-16 ensure content doesn't go under the fixed header */}
            <main className="pt-16">
                {children}
            </main>
        </section>
    )
}

export default LandingLayout;