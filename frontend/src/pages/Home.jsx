import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Home.css";

function Home() {

    return (
    <div className="home home--landing">
        <Navbar />
        <main className="home__body home__body--landing">
            <section className="hero">
                <div className="hero__content flex-col">
                    <span className="hero__eyebrow text-label">메타 기반 포켓몬 분석</span>
                    <h1 className="hero__title text-display">
                        배틀의 흐름을 읽는<br />데이터 도감, Pokédemy
                    </h1>
                    <p className="hero__desc text-body text-gray">
                        실전 매치 데이터를 바탕으로 포켓몬, 기술, 아이템, 성격 정보를 한눈에
                        정리했습니다. 도감과 계산기를 오가며 팀을 더 빠르게 설계하세요.
                    </p>
                    <div className="hero__actions">
                        <Link className="hero__btn hero__btn--primary" to="/dex">
                            도감 바로가기
                        </Link>
                        <Link className="hero__btn hero__btn--ghost" to="/calculator">
                            상성 계산기
                        </Link>
                    </div>
                    <div className="hero__stats">
                        <div className="hero__stat">
                            <span className="text-label text-gray">Match 데이터</span>
                            <strong className="hero__stat-value">실전 기반</strong>
                        </div>
                        <div className="hero__stat">
                            <span className="text-label text-gray">폼/아이템</span>
                            <strong className="hero__stat-value">스프라이트 제공</strong>
                        </div>
                        <div className="hero__stat">
                            <span className="text-label text-gray">메타 분석</span>
                            <strong className="hero__stat-value">조합 인사이트</strong>
                        </div>
                    </div>
                </div>
                <div className="hero__visual">
                    <div className="visual-card">
                        <div className="visual-card__header">
                            <span className="text-label">팀 미리보기</span>
                            <span className="visual-card__tag">SV 시즌</span>
                        </div>
                        <div className="visual-card__grid">
                            <div className="visual-chip">전설 슬롯</div>
                            <div className="visual-chip">서포터</div>
                            <div className="visual-chip">스위퍼</div>
                            <div className="visual-chip">서브 딜러</div>
                            <div className="visual-chip">스피드 컨트롤</div>
                            <div className="visual-chip">유틸리티</div>
                        </div>
                        <div className="visual-card__footer">
                            <span className="text-small text-gray">최근 메타 조합을 빠르게 탐색</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="home-section">
                <div className="home-section__header">
                    <h2 className="text-title">핵심 기능</h2>
                    <p className="text-body text-gray">필요한 정보만 빠르게 꺼내는 구조로 구성했어요.</p>
                </div>
                <div className="feature-grid">
                    <article className="feature-card">
                        <h3 className="text-subtitle">매치 기반 추천</h3>
                        <p className="text-body text-gray">
                            승/패 데이터를 기반으로 기술·아이템·테라스타입 선택을 정리합니다.
                        </p>
                    </article>
                    <article className="feature-card">
                        <h3 className="text-subtitle">한눈에 보는 분포</h3>
                        <p className="text-body text-gray">
                            포켓몬, 기술, 특성, 성격 분포를 카드 단위로 확인할 수 있습니다.
                        </p>
                    </article>
                    <article className="feature-card">
                        <h3 className="text-subtitle">즉시 계산</h3>
                        <p className="text-body text-gray">
                            상성 계산기로 파티의 약점을 빠르게 체크하고 보완하세요.
                        </p>
                    </article>
                </div>
            </section>

            <section className="home-section home-section--steps">
                <div className="home-section__header">
                    <h2 className="text-title">이용 흐름</h2>
                    <p className="text-body text-gray">도감 → 매치 인사이트 → 계산 순으로 추천합니다.</p>
                </div>
                <div className="steps">
                    <div className="step-card">
                        <span className="step-card__index">01</span>
                        <div>
                            <h4 className="text-subtitle">도감 탐색</h4>
                            <p className="text-body text-gray">포켓몬 기본 정보와 분포를 확인합니다.</p>
                        </div>
                    </div>
                    <div className="step-card">
                        <span className="step-card__index">02</span>
                        <div>
                            <h4 className="text-subtitle">매치 분석</h4>
                            <p className="text-body text-gray">승/패 데이터로 실전 선택지를 좁혀요.</p>
                        </div>
                    </div>
                    <div className="step-card">
                        <span className="step-card__index">03</span>
                        <div>
                            <h4 className="text-subtitle">상성 계산</h4>
                            <p className="text-body text-gray">팀의 취약점을 확인하고 보완합니다.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="cta">
                <div>
                    <h2 className="text-title">오늘 팀 메타를 점검해볼까요?</h2>
                    <p className="text-body text-gray">
                        데이터 기반 인사이트로 빠르게 전략을 세워보세요.
                    </p>
                </div>
                <Link className="hero__btn hero__btn--primary" to="/dex">
                    도감 열기
                </Link>
            </section>
        </main>
    </div>
    );
}

export default Home;
